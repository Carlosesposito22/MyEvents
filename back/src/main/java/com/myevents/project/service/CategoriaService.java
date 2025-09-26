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

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Optional<Categoria> findById(int id_categoria) {
        return categoriaRepository.findById(id_categoria);
    }

    public List<Categoria> buscarSubcategorias(int id_categoria_pai) {
        if (categoriaRepository.findById(id_categoria_pai).isEmpty()) {
            throw new RuntimeException("A categoria pai com o ID " + id_categoria_pai + " não foi encontrada.");
        }
        return categoriaRepository.findByCategoriaPaiId(id_categoria_pai);
    }

    public List<CategoriaPaiDTO> findAllComNomesPai() {
        return categoriaRepository.findAllComNomesPai();
    }

    public List<Categoria> findByNomeContaining(String nome) {
        return categoriaRepository.findByNomeContaining(nome);
    }

    public void save(CategoriaDTO categoria) {
        validateCategoria(categoria, null);
        categoriaRepository.save(categoria);
    }

    public void update(int id_categoria, CategoriaDTO categoria) {
        if (categoriaRepository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        validateCategoria(categoria, id_categoria);
        categoriaRepository.update(id_categoria, categoria);
    }

    public void deleteById(int id_categoria) {
        if (categoriaRepository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        categoriaRepository.deleteById(id_categoria);
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
            if (categoriaRepository.findById(categoria.getId_categoria_pai()).isEmpty()) {
                throw new IllegalArgumentException("A categoria pai com o ID " + categoria.getId_categoria_pai() + " não existe.");
            }
        }
    }
}