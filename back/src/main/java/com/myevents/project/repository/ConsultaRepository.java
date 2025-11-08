package com.myevents.project.repository;

import com.myevents.project.dto.entrega4.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ConsultaRepository {

    private final JdbcTemplate jdbcTemplate;

    public ConsultaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<LocalNaoUtilizadoDTO> findLocaisNaoUtilizados() {
        String sql = """
            SELECT
                L.id_local, L.NomeLocal, L.cidade, L.capacidade
            FROM
                Local AS L
            LEFT JOIN
                EventoPresencial AS EP ON L.id_local = EP.id_local
            WHERE
                EP.id_evento IS NULL;
        """;
        return jdbcTemplate.query(sql, new LocalNaoUtilizadoRowMapper());
    }

    public List<PalestranteEspecialidadeDTO> findPalestranteEspecialidadeFullJoin() {
        String sql = """
            SELECT
                P.nome AS NomePalestrante, E.nome AS NomeEspecialidade
            FROM
                Palestrante AS P
            LEFT JOIN
                Palestrante_Especialidade AS PE ON P.id_palestrante = PE.id_palestrante
            LEFT JOIN
                Especialidade AS E ON PE.id_especialidade = E.id_especialidade
            UNION
            SELECT
                P.nome AS NomePalestrante, E.nome AS NomeEspecialidade
            FROM
                Palestrante AS P
            RIGHT JOIN
                Palestrante_Especialidade AS PE ON P.id_palestrante = PE.id_palestrante
            RIGHT JOIN
                Especialidade AS E ON PE.id_especialidade = E.id_especialidade;
        """;
        return jdbcTemplate.query(sql, new PalestranteEspecialidadeRowMapper());
    }

    public List<EventoAcimaMediaDTO> findEventosAcimaMedia() {
        String sql = """
            SELECT
                id_evento, titulo, numero_participantes, expectativa_participantes
            FROM
                Evento
            WHERE
                numero_participantes > (SELECT AVG(numero_participantes) FROM Evento);
        """;
        return jdbcTemplate.query(sql, new EventoAcimaMediaRowMapper());
    }

    public List<AtividadeFiltradaDTO> findAtividadesPorCategoriaData(String nomeCategoria, LocalDate dataInicio, LocalDate dataFim) {
        String sql = """
            SELECT
                A.id_atividade, A.titulo AS TituloAtividade, E.titulo AS TituloEvento
            FROM
                Atividade AS A
            JOIN
                Evento AS E ON A.id_evento = E.id_evento
            WHERE
                E.id_categoria IN (
                    SELECT id_categoria FROM Categoria
                    WHERE nome = ?
                    OR id_categoria_pai = (SELECT id_categoria FROM Categoria WHERE nome = ?)
                )
            AND
                E.data_inicio >= ? AND E.data_fim <= ?;
        """;
        return jdbcTemplate.query(sql, new AtividadeFiltradaRowMapper(), nomeCategoria, nomeCategoria, dataInicio, dataFim);
    }

    public List<ViewDetalhesEventoDTO> findAllDetalhesEvento() {
        String sql = "SELECT * FROM vw_DetalhesCompletosEvento";
        return jdbcTemplate.query(sql, new ViewDetalhesEventoRowMapper());
    }

    public Optional<ViewDetalhesEventoDTO> findDetalhesEventoById(int id_evento) {
        String sql = "SELECT * FROM vw_DetalhesCompletosEvento WHERE id_evento = ?";
        try {
            ViewDetalhesEventoDTO result = jdbcTemplate.queryForObject(sql, new ViewDetalhesEventoRowMapper(), id_evento);
            return Optional.ofNullable(result);
        }
        catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<ViewGradeAtividadeDTO> findAllGradeAtividades() {
        String sql = "SELECT * FROM vw_GradeAtividadesPalestrates";
        return jdbcTemplate.query(sql, new ViewGradeAtividadeRowMapper());
    }

    public List<ViewGradeAtividadeDTO> findGradeAtividadesByEventoId(int id_evento) {
        String sql = "SELECT * FROM vw_GradeAtividadesPalestrates WHERE id_evento = ?";
        return jdbcTemplate.query(sql, new ViewGradeAtividadeRowMapper(), id_evento);
    }

    private static class LocalNaoUtilizadoRowMapper implements RowMapper<LocalNaoUtilizadoDTO> {
        @Override
        public LocalNaoUtilizadoDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            LocalNaoUtilizadoDTO dto = new LocalNaoUtilizadoDTO();
            dto.setId_local(rs.getInt("id_local"));
            dto.setNomeLocal(rs.getString("NomeLocal"));
            dto.setCidade(rs.getString("cidade"));
            dto.setCapacidade(rs.getObject("capacidade", Integer.class));
            return dto;
        }
    }

    private static class PalestranteEspecialidadeRowMapper implements RowMapper<PalestranteEspecialidadeDTO> {
        @Override
        public PalestranteEspecialidadeDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            PalestranteEspecialidadeDTO dto = new PalestranteEspecialidadeDTO();
            dto.setNomePalestrante(rs.getString("NomePalestrante"));
            dto.setNomeEspecialidade(rs.getString("NomeEspecialidade"));
            return dto;
        }
    }

    private static class EventoAcimaMediaRowMapper implements RowMapper<EventoAcimaMediaDTO> {
        @Override
        public EventoAcimaMediaDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            EventoAcimaMediaDTO dto = new EventoAcimaMediaDTO();
            dto.setId_evento(rs.getInt("id_evento"));
            dto.setTitulo(rs.getString("titulo"));
            dto.setNumero_participantes(rs.getObject("numero_participantes", Integer.class));
            dto.setExpectativa_participantes(rs.getObject("expectativa_participantes", Integer.class));
            return dto;
        }
    }

    private static class AtividadeFiltradaRowMapper implements RowMapper<AtividadeFiltradaDTO> {
        @Override
        public AtividadeFiltradaDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            AtividadeFiltradaDTO dto = new AtividadeFiltradaDTO();
            dto.setId_atividade(rs.getInt("id_atividade"));
            dto.setTituloAtividade(rs.getString("TituloAtividade"));
            dto.setTituloEvento(rs.getString("TituloEvento"));
            return dto;
        }
    }

    private static class ViewDetalhesEventoRowMapper implements RowMapper<ViewDetalhesEventoDTO> {
        @Override
        public ViewDetalhesEventoDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ViewDetalhesEventoDTO dto = new ViewDetalhesEventoDTO();
            dto.setId_evento(rs.getInt("id_evento"));
            dto.setTitulo(rs.getString("titulo"));
            dto.setData_inicio(rs.getObject("data_inicio", LocalDate.class));
            dto.setData_fim(rs.getObject("data_fim", LocalDate.class));
            dto.setNumero_participantes(rs.getObject("numero_participantes", Integer.class));
            dto.setLimite_participantes(rs.getObject("limite_participantes", Integer.class));
            dto.setCarga_horaria(rs.getObject("carga_horaria", Integer.class));
            dto.setNomeCategoria(rs.getString("NomeCategoria"));
            dto.setNomeLocal(rs.getString("NomeLocal"));
            dto.setCidade(rs.getString("cidade"));
            dto.setEstado(rs.getString("estado"));
            dto.setRua(rs.getString("rua"));
            dto.setNumeroLocal(rs.getObject("NumeroLocal", Integer.class));
            dto.setUrl_evento(rs.getString("url_evento"));
            dto.setAplicativoTrasmissao(rs.getString("aplicativoTrasmissao"));
            dto.setQtd_atividades(rs.getLong("qtd_atividades"));
            dto.setQtd_palestrantes(rs.getLong("qtd_palestrantes"));
            return dto;
        }
    }

    private static class ViewGradeAtividadeRowMapper implements RowMapper<ViewGradeAtividadeDTO> {
        @Override
        public ViewGradeAtividadeDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ViewGradeAtividadeDTO dto = new ViewGradeAtividadeDTO();
            dto.setId_evento(rs.getInt("id_evento"));
            dto.setEvento(rs.getString("Evento"));
            dto.setAtividade(rs.getString("Atividade"));
            dto.setDescricaoAtividade(rs.getString("DescricaoAtividade"));
            dto.setCarga_horaria(rs.getObject("carga_horaria", Integer.class));
            dto.setTipoAtividade(rs.getString("TipoAtividade"));
            dto.setPalestrante(rs.getString("Palestrante"));
            dto.setBioPalestrante(rs.getString("BioPalestrante"));
            dto.setLinkedin(rs.getString("linkedin"));
            return dto;
        }
    }
}