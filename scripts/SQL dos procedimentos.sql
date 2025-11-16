/*
 * TABELA DE LOG (necessária para o Procedimento 1)
 * JUSTIFICATIVA: Esta tabela é essencial para auditoria. Ela armazena o "antes" e o "depois"
 * de alterações em campos críticos do evento, permitindo rastrear quem
 * e quando alterou dados importantes.
 */
CREATE TABLE EventoAtualizacaoLog (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT,
    campo_alterado VARCHAR(50),
    valor_antigo VARCHAR(300),
    valor_novo VARCHAR(300),
    data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*
 * PROCEDIMENTO 1: sp_atualiza_evento (Atualização Auditada de Evento)
 *
 * JUSTIFICATIVA SEMÂNTICA: Este procedimento é vital para garantir a integridade 
 * e a rastreabilidade dos dados. A sua principal função semântica é
 * encapsular uma transação de negócio que vai além de um simples UPDATE.
 *
 * 1. REGRA DE NEGÓCIO: Ele centraliza a lógica de negócio que dita que:
 * a) A atualização só deve ocorrer se o valor novo for realmente diferente do antigo.
 * b) Qualquer alteração em campos sensíveis (como 'título' ou 'limite_participantes')
 * DEVE ser registrada para auditoria.
 */
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_atualiza_evento`(
    IN p_id_evento INT,
    IN p_titulo_novo VARCHAR(300),
    IN p_limite_participantes_novo INT
)
BEGIN
    DECLARE v_titulo_atual VARCHAR(300);
    DECLARE v_limite_atual INT;

    SELECT titulo, limite_participantes
      INTO v_titulo_atual, v_limite_atual
      FROM Evento WHERE id_evento = p_id_evento;

    IF v_titulo_atual <> p_titulo_novo THEN
        UPDATE Evento SET titulo = p_titulo_novo WHERE id_evento = p_id_evento;
        INSERT INTO EventoAtualizacaoLog (id_evento, campo_alterado, valor_antigo, valor_novo)
        VALUES (p_id_evento, 'titulo', v_titulo_atual, p_titulo_novo);
    END IF;

    IF v_limite_atual <> p_limite_participantes_novo THEN
        UPDATE Evento SET limite_participantes = p_limite_participantes_novo WHERE id_evento = p_id_evento;
        INSERT INTO EventoAtualizacaoLog (id_evento, campo_alterado, valor_antigo, valor_novo)
        VALUES (p_id_evento, 'limite_participantes', v_limite_atual, p_limite_participantes_novo);
    END IF;
END $$
DELIMITER ;

/*
 * PROCEDIMENTO 2: sp_relatorio_detalhado_eventos (Relatório Agregado com Cursor)
 *
 * JUSTIFICATIVA SEMÂNTICA: Este procedimento atende ao requisito de usar um
 * CURSOR para realizar um processamento complexo "linha a linha"
 * que não poderia ser feito com um único comando UPDATE.
 *
 * GERAÇÃO DE RELATÓRIO: A tarefa aqui é gerar um relatório, não atualizar
 * dados. Para cada evento no loop, a procedure executa duas subconsultas
 * pesadas (um COUNT em Atividades e um GROUP_CONCAT em Palestrantes,
 * envolvendo 3 tabelas).
 */
DELIMITER $$
CREATE PROCEDURE sp_relatorio_detalhado_eventos()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_id_evento INT;
    DECLARE v_titulo VARCHAR(300);
    DECLARE v_qtd_atividades INT;
    DECLARE v_lista_palestrantes TEXT;

    DECLARE cur_eventos CURSOR FOR
        SELECT id_evento, titulo FROM Evento;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TEMPORARY TABLE IF EXISTS tmp_relatorio_eventos;
    CREATE TEMPORARY TABLE tmp_relatorio_eventos (
        id_evento INT,
        titulo VARCHAR(300),
        qtd_atividades INT,
        palestrantes TEXT
    );

    OPEN cur_eventos;
    evento_loop: LOOP
        FETCH cur_eventos INTO v_id_evento, v_titulo;
        IF done THEN
            LEAVE evento_loop;
        END IF;

        SELECT COUNT(*) INTO v_qtd_atividades FROM Atividade WHERE id_evento = v_id_evento;

        SELECT GROUP_CONCAT(DISTINCT P.nome SEPARATOR '; ') INTO v_lista_palestrantes
        FROM Atividade A
        JOIN Apresentacao AP ON A.id_atividade = AP.id_atividade
        JOIN Palestrante P ON AP.id_palestrante = P.id_palestrante
        WHERE A.id_evento = v_id_evento;

        INSERT INTO tmp_relatorio_eventos VALUES (
            v_id_evento, v_titulo, v_qtd_atividades, IFNULL(v_lista_palestrantes, 'Nenhum')
        );
    END LOOP;
    CLOSE cur_eventos;

    SELECT * FROM tmp_relatorio_eventos;
END $$
DELIMITER ;