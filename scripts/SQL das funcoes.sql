/*
 * FUNÇÃO 1: fn_status_evento_lotacao (Monitoramento de Lotação do Evento)
 * JUSTIFICATIVA SEMÂNTICA: Esta função é crucial para o painel administrativo do organizador do evento. 
 * Em vez de apenas mostrar números brutos (ex: 185 inscritos / 200 limite), 
 * ela traduz esses dados em um status textual claro e de fácil compreensão (ex: "Quase cheio", "Evento lotado").
 * O uso da estrutura condicional é o ponto-chave, pois permite aplicar regras de negócio vitais:
 * 1. Identifica eventos com vagas ilimitadas.
 * 2. Alerta proativamente quando a ocupação atinge um nível crítico (ex: 90%).
 * 3. Sugere uma ação de negócio (ex: "Considere aumentar o limite") quando o evento lota.
 */
DELIMITER $$
CREATE FUNCTION fn_status_evento_lotacao(p_id_evento INT)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE v_limite INT;
    DECLARE v_atual INT;
    DECLARE v_percentual FLOAT;
    SELECT limite_participantes, numero_participantes INTO v_limite, v_atual  FROM Evento WHERE id_evento = p_id_evento;
    
    IF v_limite = 0 THEN
        RETURN 'Evento sem limite de participantes';
    END IF;

    SET v_percentual = (v_atual / v_limite) * 100;

    IF v_atual >= v_limite THEN
        RETURN CONCAT('Evento lotado. Participantes: ', v_atual, '/', v_limite,
                      '. Considere aumentar o limite.');
    ELSEIF v_percentual >= 90 THEN
        RETURN CONCAT('Quase cheio (', v_atual, '/', v_limite, 
                      '). Apenas ', v_limite - v_atual, ' vagas restantes.');
    ELSEIF v_percentual >= 60 THEN
        RETURN CONCAT('Ocupação moderada (', v_atual, '/', v_limite, ').');
    ELSE
        RETURN CONCAT('Muitas vagas disponíveis (', v_atual, '/', v_limite, ').');
    END IF;
END $$
DELIMITER ;

/*
 * FUNÇÃO 2: fn_resumo_eventos_palestrante (Sumário de Participação por Palestrante)
 * JUSTIFICATIVA SEMÂNTICA: O objetivo desta função é gerar um resumo textual 
 * consolidado das participações de um palestrante. Em um sistema de eventos, é
 * muito comum precisar exibir um "cartão" ou "perfil" do palestrante, e esta
 * função serve diretamente a esse propósito.
 * Os parâmetros opcionais (p_ano, p_id_categoria) aumentam sua reutilização,
 * permitindo que a mesma função seja usada para filtros na interface do usuário
 * (ex: "Ver palestras de 2024" ou "Ver palestras de 'Tecnologia'").
 */
DELIMITER $$
CREATE FUNCTION fn_resumo_eventos_palestrante(
    p_id_palestrante INT,
    p_ano INT,
    p_id_categoria INT
)
RETURNS TEXT
DETERMINISTIC
BEGIN
    DECLARE v_resultado TEXT;

    SELECT 
        IFNULL(CONCAT(
            'Total: ', COUNT(DISTINCT E.id_evento), '. Eventos: ',
            GROUP_CONCAT(DISTINCT E.titulo SEPARATOR '; ')
        ), 'Nenhuma apresentação encontrada.')
    INTO v_resultado
    FROM Apresentacao AP
    JOIN Atividade A ON AP.id_atividade = A.id_atividade
    JOIN Evento E ON A.id_evento = E.id_evento
    WHERE AP.id_palestrante = p_id_palestrante
      AND (YEAR(E.data_inicio) = p_ano OR p_ano IS NULL)
      AND (E.id_categoria = p_id_categoria OR p_id_categoria IS NULL);

    RETURN v_resultado;
END $$
DELIMITER ;