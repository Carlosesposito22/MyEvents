package com.myevents.project.controller;

import com.myevents.project.dto.entrega4.*;
import com.myevents.project.dto.entrega5.*;
import com.myevents.project.service.ConsultaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    // --- Consulta 1 ---
    @GetMapping("/locais-nao-utilizados")
    public ResponseEntity<List<LocalNaoUtilizadoDTO>> getLocaisNaoUtilizados() {
        return ResponseEntity.ok(consultaService.getLocaisNaoUtilizados());
    }

    // --- Consulta 2 ---
    @GetMapping("/palestrantes-especialidades")
    public ResponseEntity<List<PalestranteEspecialidadeDTO>> getPalestrantesEspecialidades() {
        return ResponseEntity.ok(consultaService.getPalestranteEspecialidadeFullJoin());
    }

    // --- Consulta 3 ---
    @GetMapping("/eventos-acima-media")
    public ResponseEntity<List<EventoAcimaMediaDTO>> getEventosAcimaMedia() {
        return ResponseEntity.ok(consultaService.getEventosAcimaMedia());
    }

    // --- Consulta 4 ---
    @GetMapping("/atividades-filtradas")
    public ResponseEntity<List<AtividadeFiltradaDTO>> getAtividadesFiltradas(
            @RequestParam("categoria") String categoria,
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        List<AtividadeFiltradaDTO> lista = consultaService.getAtividadesPorCategoriaData(categoria, inicio, fim);
        return ResponseEntity.ok(lista);
    }

    // --- View 1 ---
    @GetMapping("/view/detalhes-eventos")
    public ResponseEntity<List<ViewDetalhesEventoDTO>> getDetalhesEventos() {
        return ResponseEntity.ok(consultaService.getDetalhesCompletosEventos());
    }

    @GetMapping("/view/detalhes-eventos/{id}")
    public ResponseEntity<ViewDetalhesEventoDTO> getDetalhesEventoPorId(@PathVariable int id) {
        return consultaService.getDetalhesEventoById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- View 2 ---
    @GetMapping("/view/grade-atividades")
    public ResponseEntity<List<ViewGradeAtividadeDTO>> getGradeAtividades() {
        return ResponseEntity.ok(consultaService.getGradeCompletaAtividades());
    }

    @GetMapping("/view/grade-atividades/evento/{id_evento}")
    public ResponseEntity<List<ViewGradeAtividadeDTO>> getGradePorEvento(@PathVariable int id_evento) {
        return ResponseEntity.ok(consultaService.getGradeAtividadesByEventoId(id_evento));
    }

    // --- fn 1 por id---
    @GetMapping("/view/status-evento-lotacao/evento/{id_evento}")
    public ResponseEntity<EventoStatusLotacaoDTO> getStatusEventoLotacao(@PathVariable int id_evento) {
        return consultaService.getEventoStatusLotacao(id_evento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- fn 1 todos---
    @GetMapping("/view/eventos-lotados")
    public ResponseEntity<List<EventoStatusLotacaoDTO>> getEventosLotados() {
        return ResponseEntity.ok(consultaService.getEventosLotados());
    }

    // --- fn 2 todos ---
    @GetMapping("/resumo-eventos-palestrantes")
    public ResponseEntity<List<ResumoEventosPalestranteDTO>> getResumoTodosPalestrantes() {
        return ResponseEntity.ok(consultaService.getResumoTodosPalestrantes());
    }

    // --- fn 2 por id palestrante ---
    @GetMapping("/resumo-eventos-palestrante/{idPalestrante}")
    public ResponseEntity<ResumoEventosPalestranteDTO> getResumoPalestranteFiltrado(
            @PathVariable int idPalestrante,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) Integer idCategoria) {
        return consultaService.getResumoPalestrantePorFiltro(idPalestrante, ano, idCategoria)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Procedimento 2 ---
    @GetMapping("/relatorio-detalhado-eventos")
    public ResponseEntity<List<RelatorioDetalhadoEventoDTO>> getRelatorioDetalhadoEventos() {
        return ResponseEntity.ok(consultaService.getRelatorioDetalhadoEventos());
    }

    // --- Procedimento 1 geral ---
    @GetMapping("/evento-atualizacao/logs")
    public ResponseEntity<List<EventoAtualizacaoLogDTO>> getAllEventoAtualizacaoLogs() {
        return ResponseEntity.ok(consultaService.getAllEventoAtualizacaoLogs());
    }

    // --- Procedimento 1 por evento ---
    @GetMapping("/evento-atualizacao/logs/{id_evento}")
    public ResponseEntity<List<EventoAtualizacaoLogDTO>> getLogsByEventoId(@PathVariable int id_evento) {
        return ResponseEntity.ok(consultaService.getEventoAtualizacaoLogsByEventoId(id_evento));
    }

    // --- Gatilho 1 ---
    @GetMapping("/evento-exclusao/logs")
    public ResponseEntity<List<EventoExclusaoLogDTO>> getAllEventoExclusaoLogs() {
        return ResponseEntity.ok(consultaService.getAllEventoExclusaoLogs());
    }
}
