package com.myevents.project.controller;

import com.myevents.project.dto.CategoriaDTO;
import com.myevents.project.dto.CategoriaPaiDTO;
import com.myevents.project.dto.SuccessResponseDTO;
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

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> findById(@PathVariable int id) {
        Optional<Categoria> categoria = categoriaService.findById(id);
        return categoria.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/subcategorias")
    public ResponseEntity<List<Categoria>> getSubcategorias(@PathVariable int id) {
        List<Categoria> subcategorias = categoriaService.buscarSubcategorias(id);
        return ResponseEntity.ok(subcategorias);
    }

    @GetMapping("/hierarquia")
    public ResponseEntity<List<CategoriaPaiDTO>> getCategoriasComNomesPai() {
        List<CategoriaPaiDTO> lista = categoriaService.findAllComNomesPai();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Categoria>> findByNome(@RequestParam("nome") String nome) {
        List<Categoria> categorias = categoriaService.findByNomeContaining(nome);
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    public ResponseEntity<SuccessResponseDTO> save(@RequestBody CategoriaDTO categoriaDTO) {
        categoriaService.save(categoriaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponseDTO("Categoria criada com sucesso!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponseDTO> update(@PathVariable int id, @RequestBody CategoriaDTO categoria) {
        categoriaService.update(id, categoria);
        return ResponseEntity.ok(new SuccessResponseDTO("Categoria atualizada com sucesso!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        categoriaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
