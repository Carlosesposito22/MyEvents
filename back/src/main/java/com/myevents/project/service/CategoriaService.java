package com.myevents.project.service;

import com.myevents.project.model.Categoria;
import com.myevents.project.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

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

    public void save(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da categoria não pode ser nulo ou vazio.");
        }
        repository.save(categoria);
    }

    public void update(int id_categoria, Categoria categoria) {
        if (repository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        repository.update(id_categoria, categoria);
    }

    public void deleteById(int id_categoria) {
        if (repository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("Categoria não encontrada com o ID: " + id_categoria);
        }
        repository.deleteById(id_categoria);
    }
}