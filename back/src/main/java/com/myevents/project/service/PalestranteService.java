package com.myevents.project.service;

import com.myevents.project.dto.PalestranteDTO;
import com.myevents.project.model.Palestrante;
import com.myevents.project.repository.PalestranteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PalestranteService {

    private final PalestranteRepository palestranteRepository;

    public PalestranteService(PalestranteRepository palestranteRepository) {
        this.palestranteRepository = palestranteRepository;
    }

    public Optional<Palestrante> findById(int id_palestrante) {
        return palestranteRepository.findById(id_palestrante);
    }

    public List<Palestrante> findByNomeContaining(String nome) {
        return palestranteRepository.findByNomeContaining(nome);
    }

    public void save(PalestranteDTO palestrante) {
        validatePalestrante(palestrante, null);
        palestranteRepository.save(palestrante);
    }

    public void update(int id_palestrante, PalestranteDTO palestrante) {
        if (palestranteRepository.findById(id_palestrante).isEmpty()) {
            throw new RuntimeException("Palestrante não encontrado com o ID: " + id_palestrante);
        }
        validatePalestrante(palestrante, id_palestrante);
        palestranteRepository.update(id_palestrante, palestrante);
    }

    public void deleteById(int id_palestrante) {
        if (palestranteRepository.findById(id_palestrante).isEmpty()) {
            throw new RuntimeException("Palestrante não encontrado com o ID: " + id_palestrante);
        }
        palestranteRepository.deleteById(id_palestrante);
    }

    private void validatePalestrante(PalestranteDTO palestrante, Integer currentId) {
        if (palestrante.getNome() == null || palestrante.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do palestrante é obrigatório.");
        }
        if (palestrante.getNome().length() > 100) {
            throw new IllegalArgumentException("O nome do palestrante não pode exceder 100 caracteres.");
        }

        if (palestrante.getEmail() != null) {
            if (palestrante.getEmail().length() > 100) {
                throw new IllegalArgumentException("O email não pode exceder 100 caracteres.");
            }
        }

        if (palestrante.getBiografia() != null && palestrante.getBiografia().length() > 1000) {
            throw new IllegalArgumentException("A biografia não pode exceder 1000 caracteres.");
        }

        if (palestrante.getLinkedin() != null) {
            if (palestrante.getLinkedin().length() > 100) {
                throw new IllegalArgumentException("O link do Linkedin não pode exceder 100 caracteres.");
            }
        }

        if (palestrante.getLattes() != null) {
            if (palestrante.getLattes().length() > 100) {
                throw new IllegalArgumentException("O link do Lattes não pode exceder 100 caracteres.");
            }
        }
    }
}