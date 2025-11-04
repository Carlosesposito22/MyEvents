package com.myevents.project.controller;

import com.myevents.project.dto.PalestranteDTO;
import com.myevents.project.dto.SuccessResponseDTO;
import com.myevents.project.model.Palestrante;
import com.myevents.project.service.PalestranteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/palestrante")
public class PalestranteController {

    private final PalestranteService palestranteService;

    public PalestranteController(PalestranteService palestranteService) {
        this.palestranteService = palestranteService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Palestrante> findById(@PathVariable int id) {
        Optional<Palestrante> palestrante = palestranteService.findById(id);
        return palestrante.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Palestrante>> findByNome(@RequestParam("nome") String nome) {
        List<Palestrante> palestrantes = palestranteService.findByNomeContaining(nome);
        return ResponseEntity.ok(palestrantes);
    }

    @PostMapping
    public ResponseEntity<SuccessResponseDTO> save(@RequestBody PalestranteDTO palestranteDTO) {
        palestranteService.save(palestranteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponseDTO("Palestrante criado com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponseDTO> update(@PathVariable int id, @RequestBody PalestranteDTO palestranteDTO) {
        palestranteService.update(id, palestranteDTO);
        return ResponseEntity.ok(new SuccessResponseDTO("Palestrante atualizado com sucesso!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        palestranteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}