package com.myevents.project.repository;

import com.myevents.project.dto.EventoDTO;
import com.myevents.project.model.Evento;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class EventoRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Evento> findById(int id_evento) {
        String sql = "SELECT * FROM Evento WHERE id_evento = ?";
        try {
            Evento result = jdbcTemplate.queryForObject(sql, new EventoRowMapper(), id_evento);
            return Optional.ofNullable(result);
        }
        catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Evento> findByTituloContaining(String titulo) {
        String sql = "SELECT * FROM Evento WHERE LOWER(titulo) LIKE LOWER(?)";
        String search= "%" + titulo + "%";
        return jdbcTemplate.query(sql, new EventoRowMapper(), search);
    }

    public void save(EventoDTO evento) {
        String sql = "INSERT INTO Evento (titulo, data_inicio, data_fim, carga_horaria, " +
                    "limite_participantes, expectiva_participantes, numero_participantes, " +
                    "id_categoria, email_duvidas, numero_membros_comissao) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                evento.getTitulo(),
                evento.getData_inicio(),
                evento.getData_fim(),
                evento.getCarga_horaria(),
                evento.getLimite_participantes(),
                evento.getExpectiva_participantes(),
                evento.getNumero_participantes(),
                evento.getId_categoria(),
                evento.getEmail_duvidas(),
                evento.getNumero_membros_comissao()
        );
    }

    public void update(int id_evento, EventoDTO evento) {
        String sql = "UPDATE Evento SET titulo = ?, data_inicio = ?, data_fim = ?, carga_horaria = ?, " +
                    "limite_participantes = ?, expectiva_participantes = ?, numero_participantes = ?, " +
                    "id_categoria = ?, email_duvidas = ?, numero_membros_comissao = ? " +
                    "WHERE id_evento = ?";
        jdbcTemplate.update(sql,
                evento.getTitulo(),
                evento.getData_inicio(),
                evento.getData_fim(),
                evento.getCarga_horaria(),
                evento.getLimite_participantes(),
                evento.getExpectiva_participantes(),
                evento.getNumero_participantes(),
                evento.getId_categoria(),
                evento.getEmail_duvidas(),
                evento.getNumero_membros_comissao(),
                id_evento
        );
    }

    public void deleteById(int id_evento) {
        String sql = "DELETE FROM Evento WHERE id_evento = ?";
        jdbcTemplate.update(sql, id_evento);
    }

    private static class EventoRowMapper implements RowMapper<Evento> {
        @Override
        public Evento mapRow(ResultSet rs, int rowNum) throws SQLException {
            Evento evento = new Evento();
            evento.setId_evento(rs.getInt("id_evento"));
            evento.setTitulo(rs.getString("titulo"));
            evento.setData_inicio(rs.getDate("data_inicio").toLocalDate());
            evento.setData_fim(rs.getDate("data_fim").toLocalDate());
            evento.setCarga_horaria(rs.getObject("carga_horaria", Integer.class));
            evento.setLimite_participantes(rs.getInt("limite_participantes"));
            evento.setExpectiva_participantes(rs.getInt("expectiva_participantes"));
            evento.setNumero_participantes(rs.getInt("numero_participantes"));
            evento.setId_categoria(rs.getInt("id_categoria"));
            evento.setEmail_duvidas(rs.getString("email_duvidas"));
            evento.setNumero_membros_comissao(rs.getInt("numero_membros_comissao"));
            return evento;
        }
    }
}