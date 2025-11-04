package com.myevents.project.repository;

import com.myevents.project.dto.PalestranteDTO;
import com.myevents.project.model.Palestrante;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class PalestranteRepository {

    private final JdbcTemplate jdbcTemplate;

    public PalestranteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Palestrante> findById(int id_palestrante) {
        String sql = "SELECT * FROM Palestrante WHERE id_palestrante = ?";
        try {
            Palestrante result = jdbcTemplate.queryForObject(sql, new PalestranteRowMapper(), id_palestrante);
            return Optional.ofNullable(result);
        }
        catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Palestrante> findByNomeContaining(String nome) {
        String sql = "SELECT * FROM Palestrante WHERE LOWER(nome) LIKE LOWER(?)";
        String search = "%" + nome + "%";
        return jdbcTemplate.query(sql, new PalestranteRowMapper(), search);
    }

    public void save(PalestranteDTO palestrante) {
        String sql = "INSERT INTO Palestrante (nome, email, biografia, linkedin, lattes) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                palestrante.getNome(),
                palestrante.getEmail(),
                palestrante.getBiografia(),
                palestrante.getLinkedin(),
                palestrante.getLattes()
        );
    }

    public void update(int id_palestrante, PalestranteDTO palestrante) {
        String sql = """
            UPDATE Palestrante SET 
            nome = ?, email = ?, biografia = ?, linkedin = ?, lattes = ? 
            WHERE id_palestrante = ?
        """;
        jdbcTemplate.update(sql,
                palestrante.getNome(),
                palestrante.getEmail(),
                palestrante.getBiografia(),
                palestrante.getLinkedin(),
                palestrante.getLattes(),
                id_palestrante
        );
    }

    public void deleteById(int id_palestrante) {
        String sql = "DELETE FROM Palestrante WHERE id_palestrante = ?";
        jdbcTemplate.update(sql, id_palestrante);
    }

    private static class PalestranteRowMapper implements RowMapper<Palestrante> {
        @Override
        public Palestrante mapRow(ResultSet rs, int rowNum) throws SQLException {
            Palestrante palestrante = new Palestrante();
            palestrante.setId_palestrante(rs.getInt("id_palestrante"));
            palestrante.setNome(rs.getString("nome"));
            palestrante.setEmail(rs.getString("email"));
            palestrante.setBiografia(rs.getString("biografia"));
            palestrante.setLinkedin(rs.getString("linkedin"));
            palestrante.setLattes(rs.getString("lattes"));
            return palestrante;
        }
    }
}