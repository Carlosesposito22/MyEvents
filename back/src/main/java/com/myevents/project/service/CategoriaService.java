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
}
