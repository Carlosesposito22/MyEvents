package com.myevents.project.repository;

import com.myevents.project.dto.AtividadeDTO;
import com.myevents.project.model.Atividade;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AtividadeRepository {

    private final JdbcTemplate jdbcTemplate;

    public AtividadeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Atividade> findById(int id_atividade) {
        String sql = "SELECT * FROM Atividade WHERE id_atividade = ?";
        try {
            Atividade result = jdbcTemplate.queryForObject(sql, new AtividadeRowMapper(), id_atividade);
            return Optional.ofNullable(result);
        }
        catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Atividade> findByEventoId(int id_evento) {
        String sql = "SELECT * FROM Atividade WHERE id_evento = ?";
        return jdbcTemplate.query(sql, new AtividadeRowMapper(), id_evento);
    }

    public List<Atividade> findByTituloContaining(String titulo) {
        String sql = "SELECT * FROM Atividade WHERE LOWER(titulo) LIKE LOWER(?)";
        String search = "%" + titulo + "%";
        return jdbcTemplate.query(sql, new AtividadeRowMapper(), search);
    }

    public void save(AtividadeDTO atividade) {
        String sql = """
            INSERT INTO Atividade
            (titulo, descricao, limite_vagas, link_transmissao_atividade, carga_horaria, id_evento, id_tipoAtividade)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getLimite_vagas(),
                atividade.getLink_transmissao_atividade(),
                atividade.getCarga_horaria(),
                atividade.getId_evento(),
                atividade.getId_tipoAtividade()
        );
    }

    public void update(int id_atividade, AtividadeDTO atividade) {
        String sql = """
            UPDATE Atividade SET
            titulo = ?, descricao = ?, limite_vagas = ?, link_transmissao_atividade = ?,
            carga_horaria = ?, id_evento = ?, id_tipoAtividade = ?
            WHERE id_atividade = ?
        """;
        jdbcTemplate.update(sql,
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getLimite_vagas(),
                atividade.getLink_transmissao_atividade(),
                atividade.getCarga_horaria(),
                atividade.getId_evento(),
                atividade.getId_tipoAtividade(),
                id_atividade
        );
    }

    public void deleteById(int id_atividade) {
        String sql = "DELETE FROM Atividade WHERE id_atividade = ?";
        jdbcTemplate.update(sql, id_atividade);
    }

    private static class AtividadeRowMapper implements RowMapper<Atividade> {
        @Override
        public Atividade mapRow(ResultSet rs, int rowNum) throws SQLException {
            Atividade atividade = new Atividade();
            atividade.setId_atividade(rs.getInt("id_atividade"));
            atividade.setTitulo(rs.getString("titulo"));
            atividade.setDescricao(rs.getString("descricao"));
            atividade.setLimite_vagas(rs.getObject("limite_vagas", Integer.class));
            atividade.setLink_transmissao_atividade(rs.getString("link_transmissao_atividade"));
            atividade.setCarga_horaria(rs.getObject("carga_horaria", Integer.class));
            atividade.setId_evento(rs.getInt("id_evento"));
            atividade.setId_tipoAtividade(rs.getInt("id_tipoAtividade"));
            return atividade;
        }
    }
}