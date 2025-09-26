package com.myevents.project.service;

import com.myevents.project.dto.CategoriaDTO;
import com.myevents.project.dto.CategoriaPaiDTO;
import com.myevents.project.model.Categoria;
import com.myevents.project.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public Optional<Categoria> findById(int id_categoria) {
        return repository.findById(id_categoria);
    }

    public void save(CategoriaDTO categoria) {
        validateCategoria(categoria, null);
        repository.save(categoria);
    }

    public List<Categoria> buscarSubcategorias(int id_categoria_pai) {
        if (repository.findById(id_categoria_pai).isEmpty()) {
            throw new RuntimeException("A categoria pai com o ID " + id_categoria_pai + " não foi encontrada.");
        }
        return repository.findByCategoriaPaiId(id_categoria_pai);
    }

    public List<CategoriaPaiDTO> findAllComNomesPai() {
        return repository.findAllComNomesPai();
    }

    public void update(int id_categoria, CategoriaDTO categoria) {
        if (repository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        validateCategoria(categoria, id_categoria);
        repository.update(id_categoria, categoria);
    }

    public void deleteById(int id_categoria) {
        if (repository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        repository.deleteById(id_categoria);
    }

    private void validateCategoria(CategoriaDTO categoria, Integer currentId) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }

        if (categoria.getNome().length() > 100) {
            throw new IllegalArgumentException("O nome da categoria não pode exceder 100 caracteres.");
        }

        if (categoria.getDescricao() != null && categoria.getDescricao().length() > 200) {
            throw new IllegalArgumentException("A descrição da categoria não pode exceder 200 caracteres.");
        }

        if (categoria.getId_categoria_pai() != null) {
            if (categoria.getId_categoria_pai().equals(currentId)) {
                throw new IllegalArgumentException("Uma categoria não pode ser pai de si mesma.");
            }
            if (repository.findById(categoria.getId_categoria_pai()).isEmpty()) {
                throw new IllegalArgumentException("A categoria pai com o ID " + categoria.getId_categoria_pai() + " não existe.");
            }
        }
    }
}