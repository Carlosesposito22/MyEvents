package com.myevents.project.controller;

import com.myevents.project.dto.CategoriaDTO;
import com.myevents.project.model.Categoria;
import com.myevents.project.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> findById(@PathVariable int id) {
        Optional<Categoria> categoria = service.findById(id);
        return categoria.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/subcategorias")
    public ResponseEntity<?> getSubcategorias(@PathVariable int id) {
        try {
            List<Categoria> subcategorias = service.buscarSubcategorias(id);
            return ResponseEntity.ok(subcategorias);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<String> save(@RequestBody CategoriaDTO categoriaDTO) {
        try {
            service.save(categoriaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Categoria criada com sucesso!");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody CategoriaDTO categoria) {
        try {
            service.update(id, categoria);
            return ResponseEntity.ok("Categoria atualizada com sucesso!");
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable int id) {
        try {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
