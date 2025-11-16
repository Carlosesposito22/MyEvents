/*
 * Justificativa Semântica: Esta visão cria um "relatório mestre" para cada evento. 
 * Ela consolida em um só lugar todas as informações logísticas, respondendo à pergunta: "O que é este evento, 
 * onde ele acontece (se presencial), qual seu link (se online) e a qual categoria pertence?". 
 *  
 * Otimização: Esta visão será beneficiada pelo índice 2 [idx_evento_categoria_data] sempre que for 
 * consultada com um filtro ou ordenação por categoria e data 
 * (ex: SELECT * FROM vw_DetalhesCompletosEvento WHERE NomeCategoria = '...' ORDER BY data_inicio DESC).
*/
CREATE VIEW vw_DetalhesCompletosEvento AS
SELECT
    E.id_evento,
    E.titulo,
    E.data_inicio,
    E.data_fim,
    E.numero_participantes,
    E.limite_participantes,
    E.carga_horaria,
    C.nome AS NomeCategoria,
    L.NomeLocal,
    L.cidade,
    L.estado,
    L.rua,
    L.numero AS NumeroLocal,
    EO.url_evento,
    EO.aplicativoTrasmissao,
    (SELECT COUNT(*) FROM Atividade A WHERE A.id_evento = E.id_evento) AS qtd_atividades,
    (SELECT COUNT(DISTINCT AP.id_palestrante) FROM Atividade A2 JOIN Apresentacao AP ON AP.id_atividade = A2.id_atividade WHERE A2.id_evento = E.id_evento) AS qtd_palestrantes
FROM
    Evento AS E
JOIN
    Categoria AS C ON E.id_categoria = C.id_categoria
LEFT JOIN
    EventoPresencial AS EP ON E.id_evento = EP.id_evento
LEFT JOIN
    Local AS L ON EP.id_local = L.id_local
LEFT JOIN
    EventoOnline AS EO ON E.id_evento = EO.id_evento;

/*
 * Justificativa Semântica: Esta visão monta a "grade de programação" completa do sistema. 
 * Ela responde à pergunta: "Quais são as atividades do evento X, de que tipo elas são (palestra, minicurso) 
 * e quem são os palestrantes?". É a visão mais importante para os participantes e para a organização.
 * 
 * Otimização: Esta visão é a principal beneficiária do índice 1 [idx_apresentacao_por_atividade]. 
 * O JOIN entre Atividade e Apresentacao (que é uma tabela de associação N-para-N) 
 * é historicamente um gargalo em sistemas de eventos. O índice torna essa junção extremamente rápida.
*/
CREATE VIEW vw_GradeAtividadesPalestrates AS
SELECT
    E.id_evento,
    E.titulo AS Evento,
    A.titulo AS Atividade,
    A.descricao AS DescricaoAtividade,
    A.carga_horaria,
    TA.nome AS TipoAtividade,
    P.nome AS Palestrante,
    P.biografia AS BioPalestrante,
    P.linkedin
FROM
    Atividade AS A
JOIN
    Evento AS E ON A.id_evento = E.id_evento
JOIN
    TipoAtividade AS TA ON A.id_tipoAtividade = TA.id_tipoAtividade
LEFT JOIN
    Apresentacao AS AP ON A.id_atividade = AP.id_atividade
LEFT JOIN
    Palestrante AS P ON AP.id_palestrante = P.id_palestrante;