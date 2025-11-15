package com.myevents.project.service;

import com.myevents.project.dto.entrega4.*;
import com.myevents.project.dto.entrega5.*;
import com.myevents.project.repository.ConsultaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepository;

    public ConsultaService(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    public List<LocalNaoUtilizadoDTO> getLocaisNaoUtilizados() {
        return consultaRepository.findLocaisNaoUtilizados();
    }

    public List<PalestranteEspecialidadeDTO> getPalestranteEspecialidadeFullJoin() {
        return consultaRepository.findPalestranteEspecialidadeFullJoin();
    }

    public List<EventoAcimaMediaDTO> getEventosAcimaMedia() {
        return consultaRepository.findEventosAcimaMedia();
    }

    public List<AtividadeFiltradaDTO> getAtividadesPorCategoriaData(String nomeCategoria, LocalDate dataInicio, LocalDate dataFim) {
        if (nomeCategoria == null || dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Categoria, data de início e data de fim são obrigatórios.");
        }
        return consultaRepository.findAtividadesPorCategoriaData(nomeCategoria, dataInicio, dataFim);
    }

    public List<ViewDetalhesEventoDTO> getDetalhesCompletosEventos() {
        return consultaRepository.findAllDetalhesEvento();
    }

    public Optional<ViewDetalhesEventoDTO> getDetalhesEventoById(int id_evento) {
        return consultaRepository.findDetalhesEventoById(id_evento);
    }

    public List<ViewGradeAtividadeDTO> getGradeCompletaAtividades() {
        return consultaRepository.findAllGradeAtividades();
    }

    public List<ViewGradeAtividadeDTO> getGradeAtividadesByEventoId(int id_evento) {
        return consultaRepository.findGradeAtividadesByEventoId(id_evento);
    }

    public Optional<EventoStatusLotacaoDTO> getEventoStatusLotacao(int id_evento) {
        return consultaRepository.findEventoStatusLotacaoByEventoId(id_evento);
    }

    public List<EventoStatusLotacaoDTO> getEventosLotados() {
        return consultaRepository.findAllEventosLotados();
    }

    public List<ResumoEventosPalestranteDTO> getResumoTodosPalestrantes() {
        return consultaRepository.findResumoEventosTodosPalestrantes();
    }
    public Optional<ResumoEventosPalestranteDTO> getResumoPalestrantePorFiltro(
            int idPalestrante, Integer ano, Integer idCategoria) {
        return consultaRepository.findResumoEventosPalestrantePorFiltro(idPalestrante, ano, idCategoria);
    }
    public List<RelatorioDetalhadoEventoDTO> getRelatorioDetalhadoEventos() {
        return consultaRepository.relatorioDetalhadoEventos();
    }

    // Chama a procedure auditada
    public void atualizarEventoAuditado(Integer idEvento, String tituloNovo, Integer limiteParticipantesNovo) {
        consultaRepository.atualizarEventoAuditado(idEvento, tituloNovo, limiteParticipantesNovo);
    }

    // Lista TODOS os logs
    public List<EventoAtualizacaoLogDTO> getAllEventoAtualizacaoLogs() {
        return consultaRepository.findAllEventoAtualizacaoLogs();
    }

    // Lista logs por evento específico
    public List<EventoAtualizacaoLogDTO> getEventoAtualizacaoLogsByEventoId(Integer idEvento) {
        return consultaRepository.findEventoAtualizacaoLogsByEventoId(idEvento);
    }

    public List<EventoExclusaoLogDTO> getAllEventoExclusaoLogs() {
        return consultaRepository.findAllEventoExclusaoLogs();
    }
}