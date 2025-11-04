-- Tabela: Categoria

-- Consulta 1 (findById): Busca uma categoria pelo seu ID.
SELECT * FROM Categoria WHERE id_categoria = ?;

-- Consulta 2 (findByCategoriaPaiId): Busca todas as subcategorias de uma categoria pai.
SELECT id_categoria, nome, descricao, id_categoria_pai FROM Categoria WHERE id_categoria_pai = ?;

-- Consulta 3 (findAllComNomesPai): Lista todas as categorias e o nome de suas respectivas categorias pai.
SELECT
    c1.nome AS categoria_nome,
    COALESCE(c2.nome, 'Categoria Raiz') AS pai_nome
FROM
    Categoria c1
LEFT JOIN
    Categoria c2 ON c1.id_categoria_pai = c2.id_categoria
ORDER BY
    pai_nome,
    categoria_nome;

-- Consulta 4 (findByNomeContaining): Busca categorias cujo nome contenha um determinado texto.
SELECT * FROM Categoria WHERE LOWER(nome) LIKE LOWER("%" + nome + "%");

-- Consulta 5 (save): Insere uma nova categoria na tabela.
INSERT INTO Categoria (nome, descricao, id_categoria_pai) VALUES (?, ?, ?);

-- Consulta 6 (update): Atualiza os dados de uma categoria existente.
UPDATE Categoria SET nome = ?, descricao = ?, id_categoria_pai = ? WHERE id_categoria = ?;

-- Consulta 7 (deleteById): Remove uma categoria pelo seu ID.
DELETE FROM Categoria WHERE id_categoria = ?;

-- Tabela: Evento

-- Consulta 1 (findById): Busca um evento pelo seu ID.
SELECT * FROM Evento WHERE id_evento = ?;

-- Consulta 2 (findByTituloContaining): Busca eventos cujo título contenha um determinado texto.
SELECT * FROM Evento WHERE LOWER(titulo) LIKE LOWER("%" + titulo + "%");

-- Consulta 3 (findByDataBetween): Busca eventos que ocorrem dentro de um intervalo de datas.
SELECT * FROM Evento WHERE data_inicio BETWEEN ? AND ?;

-- Consulta 4 (findEventosByCategoriaId): Busca todos os eventos associados a um ID de categoria específico.
SELECT
    e.id_evento,
    e.titulo,
    e.carga_horaria,
    e.data_inicio,
    e.data_fim,
    c.nome AS nome_categoria
FROM
    Evento e
INNER JOIN
    Categoria c ON e.id_categoria = c.id_categoria
WHERE
    c.id_categoria = ?;

-- Consulta 5 (save): Insere um novo evento na tabela.
INSERT INTO Evento (
    titulo, data_inicio, data_fim, carga_horaria, 
    limite_participantes, expectiva_participantes, numero_participantes, 
    id_categoria, email_duvidas, numero_membros_comissao
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Consulta 6 (update): Atualiza os dados de um evento existente.
UPDATE Evento SET 
    titulo = ?, 
    data_inicio = ?, 
    data_fim = ?, 
    carga_horaria = ?, 
    limite_participantes = ?, 
    expectiva_participantes = ?, 
    numero_participantes = ?, 
    id_categoria = ?, 
    email_duvidas = ?, 
    numero_membros_comissao = ? 
WHERE id_evento = ?;

-- Consulta 7 (deleteById): Remove um evento pelo seu ID.
DELETE FROM Evento WHERE id_evento = ?;
