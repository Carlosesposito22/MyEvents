package com.myevents.project.repository;

import com.myevents.project.dto.CategoriaDTO;
import com.myevents.project.dto.CategoriaPaiDTO;
import com.myevents.project.model.Categoria;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository {

    private final JdbcTemplate jdbcTemplate;

    public CategoriaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Categoria> findById(int id_categoria) {
        String sql = "SELECT * FROM Categoria WHERE id_categoria = ?";
        try {
            Categoria result = jdbcTemplate.queryForObject(sql, new CategoriaRowMapper(), id_categoria);
            return Optional.ofNullable(result);
        }
        catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Categoria> findByCategoriaPaiId(int id_categoria_pai) {
        String sql = "SELECT id_categoria, nome, descricao, id_categoria_pai FROM Categoria WHERE id_categoria_pai = ?";
        return jdbcTemplate.query(sql, new CategoriaRowMapper(), id_categoria_pai);
    }

    public List<CategoriaPaiDTO> findAllComNomesPai() {
        String sql = """
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
        """;
        return jdbcTemplate.query(sql, new CategoriaPaiRowMapper());
    }

    public List<Categoria> findByNomeContaining(String nome) {
        String sql = "SELECT * FROM Categoria WHERE LOWER(nome) LIKE LOWER(?)";
        String search= "%" + nome + "%";
        return jdbcTemplate.query(sql, new CategoriaRowMapper(), search);
    }

    public void save(CategoriaDTO categoria) {
        String sql = "INSERT INTO Categoria (nome, descricao, id_categoria_pai) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql,
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getId_categoria_pai()
        );
    }

    public void update(int id_categoria, CategoriaDTO categoria) {
        String sql = "UPDATE Categoria SET nome = ?, descricao = ?, id_categoria_pai = ? WHERE id_categoria = ?";
        jdbcTemplate.update(sql,
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getId_categoria_pai(),
                id_categoria
        );
    }

    public void deleteById(int id_categoria) {
        String sql = "DELETE FROM Categoria WHERE id_categoria = ?";
        jdbcTemplate.update(sql, id_categoria);
    }

    private static class CategoriaRowMapper implements RowMapper<Categoria> {
        @Override
        public Categoria mapRow(ResultSet rs, int rowNum) throws SQLException {
            Categoria categoria = new Categoria();
            categoria.setId_categoria(rs.getInt("id_categoria"));
            categoria.setNome(rs.getString("nome"));
            categoria.setDescricao(rs.getString("descricao"));
            categoria.setId_categoria_pai(rs.getObject("id_categoria_pai", Integer.class));
            return categoria;
        }
    }

    private static class CategoriaPaiRowMapper implements RowMapper<CategoriaPaiDTO> {
        @Override
        public CategoriaPaiDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            CategoriaPaiDTO dto = new CategoriaPaiDTO();
            dto.setCategoria_nome(rs.getString("categoria_nome"));
            dto.setPai_nome(rs.getString("pai_nome"));
            return dto;
        }
    }
}
