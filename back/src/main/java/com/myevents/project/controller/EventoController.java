package com.myevents.project.controller;

import com.myevents.project.dto.EventoComCategoriaDTO;
import com.myevents.project.dto.EventoDTO;
import com.myevents.project.dto.SuccessResponseDTO;
import com.myevents.project.model.Evento;
import com.myevents.project.service.EventoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/evento")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> findById(@PathVariable int id) {
        Optional<Evento> evento = eventoService.findById(id);
        return evento.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Evento>> findByTitulo(@RequestParam("titulo") String titulo) {
        List<Evento> eventos = eventoService.findByTituloContaining(titulo);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/buscar-por-data")
    public ResponseEntity<List<Evento>> getEventosPorPeriodo(
            @RequestParam(value = "dataInicio", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(value = "dataFim", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim)
    {
        List<Evento> eventos = eventoService.findByDataBetween(dataInicio, dataFim);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/por-categoria/{id_categoria}")
    public ResponseEntity<List<EventoComCategoriaDTO>> findEventosByCategoriaId(@PathVariable int id_categoria) {
        List<EventoComCategoriaDTO> eventos = eventoService.findEventosByCategoriaId(id_categoria);
        return ResponseEntity.ok(eventos);
    }

    @PostMapping
    public ResponseEntity<SuccessResponseDTO> save(@RequestBody EventoDTO evento) {
        eventoService.save(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponseDTO("Evento criado com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponseDTO> update(@PathVariable int id, @RequestBody EventoDTO evento) {
        eventoService.update(id, evento);
        return ResponseEntity.ok(new SuccessResponseDTO("Evento atualizado com sucesso!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}