# Consulta 1 (Anti-Join na esquerda) ----------------------------------------------#
SELECT
    L.id_local,
    L.NomeLocal,
    L.cidade,
    L.capacidade
FROM
    Local AS L
LEFT JOIN
    EventoPresencial AS EP ON L.id_local = EP.id_local
WHERE
    EP.id_evento IS NULL;

# Consulta 2 (FULL OUTER JOIN) ----------------------------------------------------#
SELECT
    P.nome AS NomePalestrante,
    E.nome AS NomeEspecialidade
FROM
    Palestrante AS P
LEFT JOIN
    Palestrante_Especialidade AS PE ON P.id_palestrante = PE.id_palestrante
LEFT JOIN
    Especialidade AS E ON PE.id_especialidade = E.id_especialidade
UNION
SELECT
    P.nome AS NomePalestrante,
    E.nome AS NomeEspecialidade
FROM
    Palestrante AS P
RIGHT JOIN
    Palestrante_Especialidade AS PE ON P.id_palestrante = PE.id_palestrante
RIGHT JOIN
    Especialidade AS E ON PE.id_especialidade = E.id_especialidade;

# Consulta 3 (Subconsulta no WHERE) -----------------------------------------------#
SELECT
    id_evento,
    titulo,
    numero_participantes,
    expectativa_participantes
FROM
    Evento
WHERE
    numero_participantes > (SELECT AVG(numero_participantes) FROM Evento);

# Consulta 4 (Subconsulta com IN - [usa o idx_evento_categoria_data]) -------------#
SELECT
    A.id_atividade,
    A.titulo AS TituloAtividade,
    E.titulo AS TituloEvento
FROM
    Atividade AS A
JOIN
    Evento AS E ON A.id_evento = E.id_evento
WHERE
    E.id_categoria IN (
        SELECT id_categoria FROM Categoria
        WHERE nome = 'Medicina'
        OR id_categoria_pai = (SELECT id_categoria FROM Categoria WHERE nome = 'Medicina')
	)
AND 
	E.data_inicio >= '2024-01-01' AND E.data_fim <= '2024-12-31';