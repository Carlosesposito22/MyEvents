package com.myevents.project.controller;

import com.myevents.project.dto.AtividadeDTO;
import com.myevents.project.dto.SuccessResponseDTO;
import com.myevents.project.model.Atividade;
import com.myevents.project.service.AtividadeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/atividade")
public class AtividadeController {

    private final AtividadeService atividadeService;

    public AtividadeController(AtividadeService atividadeService) {
        this.atividadeService = atividadeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> findById(@PathVariable int id) {
        Optional<Atividade> atividade = atividadeService.findById(id);
        return atividade.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/evento/{id_evento}")
    public ResponseEntity<List<Atividade>> getAtividadesPorEvento(@PathVariable int id_evento) {
        List<Atividade> atividades = atividadeService.findByEventoId(id_evento);
        return ResponseEntity.ok(atividades);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Atividade>> findByTitulo(@RequestParam("titulo") String titulo) {
        List<Atividade> atividades = atividadeService.findByTituloContaining(titulo);
        return ResponseEntity.ok(atividades);
    }

    @PostMapping
    public ResponseEntity<SuccessResponseDTO> save(@RequestBody AtividadeDTO atividadeDTO) {
        atividadeService.save(atividadeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponseDTO("Atividade criada com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponseDTO> update(@PathVariable int id, @RequestBody AtividadeDTO atividadeDTO) {
        atividadeService.update(id, atividadeDTO);
        return ResponseEntity.ok(new SuccessResponseDTO("Atividade atualizada com sucesso!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        atividadeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}