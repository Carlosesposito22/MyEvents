/*
 * TABELA DE LOG (necessária para o Trigger 1)
 * JUSTIFICATIVA: Esta tabela é fundamental para auditoria. Diferente da
 * EventoAtualizacaoLog (que rastreia MUDANÇAS), esta tabela serve como um
 * "cemitério" de dados". Ela captura uma imagem completa
 * de um evento no exato momento em que ele foi excluído, permitindo
 * recuperação dele posteriormente
 */
CREATE TABLE EventoExclusaoLog (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT,
    titulo VARCHAR(300),
    data_inicio DATE,
    data_fim DATE,
    numero_participantes INT,
    limite_participantes INT,
    id_categoria INT,
    email_duvidas VARCHAR(100),
    numero_membros_comissao INT,
    data_exclusao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_acao VARCHAR(100)
);

/*
 * TRIGGER 1: trg_log_exclusao_evento (Auditoria de Exclusão de Evento)
 *
 * JUSTIFICATIVA SEMÂNTICA: Este trigger implementa uma política de
 * auditoria e arquivamento compulsório. No domínio de eventos, a exclusão
 * de um registro (DELETE) é uma ação drástica e potencialmente
 * irreversível, que pode ser acidental ou maliciosa.
 */
DELIMITER $$
CREATE TRIGGER trg_log_exclusao_evento
BEFORE DELETE ON Evento
FOR EACH ROW
BEGIN
    INSERT INTO EventoExclusaoLog (
        id_evento, titulo, data_inicio, data_fim, numero_participantes,
        limite_participantes, id_categoria, email_duvidas, numero_membros_comissao,
        usuario_acao
    ) VALUES (
        OLD.id_evento, OLD.titulo, OLD.data_inicio, OLD.data_fim, OLD.numero_participantes,
        OLD.limite_participantes, OLD.id_categoria, OLD.email_duvidas, OLD.numero_membros_comissao,
        CURRENT_USER()
    );
END $$
DELIMITER ;

/*
 * TRIGGER 2: trg_bloqueia_update_data_evento (Proteção de Dados Históricos)
 *
 * JUSTIFICATIVA SEMÂNTICA: Esta trigger é um mecanismo de proteção da
 * integridade histórica dos dados. A sua função semântica é aplicar uma
 * regra de negócio que impede a corrupção de registros passados.
 */
DELIMITER $$
CREATE TRIGGER trg_bloqueia_update_data_evento
BEFORE UPDATE ON Evento
FOR EACH ROW
BEGIN
    IF (OLD.data_fim < CURDATE() AND NEW.data_fim <> OLD.data_fim) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Não é permitido alterar datas de eventos já encerrados.';
    END IF;
END $$
DELIMITER ;