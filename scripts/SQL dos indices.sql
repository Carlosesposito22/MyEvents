/*
 * ÍNDICE 1: Otimização para a "Visão 2 (vw_GradeAtividadesPalestrates)"
 * JUSTIFICATIVA: A Visão 2 precisa juntar Atividade com Apresentacao.
 * A chave primária de Apresentacao é (id_palestrante, id_atividade).
 * Quando o banco de dados for fazer o JOIN usando [ON A.id_atividade = AP.id_atividade],
 * ele não consegue usar essa PK de forma eficiente.
 */
CREATE INDEX idx_apresentacao_por_atividade ON Apresentacao(id_atividade);

/*
 * ÍNDICE 2: Otimização para a "Consulta 4" e "Visão 1 (vw_DetalhesCompletosEvento)"
 * JUSTIFICATIVA: A Consulta 4 e a Visão 1 precisam filtrar o evento por "id_categoria".
 * Além disso, para a Visão 1, é comum que o usuário queira ver os eventos mais recentes primeiro.
 * Esse índice composto em (id_categoria, data_inicio DESC) permite que o banco de dados:
 * 1. Encontre todos os eventos de uma categoria (para a Consulta 4).
 * 2. Já os traga pré-ordenados por data de início (extremamente útil para consultas como "Ver eventos de Tecnologia ordenados por data").
 */
CREATE INDEX idx_evento_categoria_data ON Evento(id_categoria, data_inicio DESC);