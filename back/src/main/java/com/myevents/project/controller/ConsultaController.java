package com.myevents.project.controller;

import com.myevents.project.dto.entrega4.*;
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
}