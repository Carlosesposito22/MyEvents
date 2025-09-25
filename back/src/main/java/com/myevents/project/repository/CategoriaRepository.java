package com.myevents.project.repository;

import com.myevents.project.dto.CategoriaDTO;
import com.myevents.project.model.Categoria;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
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
}
