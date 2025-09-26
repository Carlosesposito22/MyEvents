package com.myevents.project.controller;

import com.myevents.project.dto.EventoDTO;
import com.myevents.project.model.Evento;
import com.myevents.project.service.EventoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<String> save(@RequestBody EventoDTO evento) {
        try {
            eventoService.save(evento);
            return ResponseEntity.status(HttpStatus.CREATED).body("Evento criado com sucesso!");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody EventoDTO evento) {
        try {
            eventoService.update(id, evento);
            return ResponseEntity.ok("Evento atualizado com sucesso!");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable int id) {
        try {
            eventoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}