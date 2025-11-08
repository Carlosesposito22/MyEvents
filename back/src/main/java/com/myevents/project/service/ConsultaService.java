package com.myevents.project.service;

import com.myevents.project.dto.entrega4.*;
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
}