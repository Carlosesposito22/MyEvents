package com.myevents.project.service;

import com.myevents.project.dto.AtividadeDTO;
import com.myevents.project.model.Atividade;
import com.myevents.project.repository.AtividadeRepository;
import com.myevents.project.repository.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final EventoRepository eventoRepository;

    public AtividadeService(AtividadeRepository atividadeRepository, EventoRepository eventoRepository) {
        this.atividadeRepository = atividadeRepository;
        this.eventoRepository = eventoRepository;
    }

    public Optional<Atividade> findById(int id_atividade) {
        return atividadeRepository.findById(id_atividade);
    }

    public List<Atividade> findByEventoId(int id_evento) {
        if (eventoRepository.findById(id_evento).isEmpty()) {
            throw new RuntimeException("O evento com o ID " + id_evento + " não foi encontrado.");
        }
        return atividadeRepository.findByEventoId(id_evento);
    }

    public List<Atividade> findByTituloContaining(String titulo) {
        return atividadeRepository.findByTituloContaining(titulo);
    }

    public void save(AtividadeDTO atividade) {
        validateAtividade(atividade);
        atividadeRepository.save(atividade);
    }

    public void update(int id_atividade, AtividadeDTO atividade) {
        if (atividadeRepository.findById(id_atividade).isEmpty()) {
            throw new RuntimeException("Atividade não encontrada com o ID: " + id_atividade);
        }
        validateAtividade(atividade);
        atividadeRepository.update(id_atividade, atividade);
    }

    public void deleteById(int id_atividade) {
        if (atividadeRepository.findById(id_atividade).isEmpty()) {
            throw new RuntimeException("Atividade não encontrada com o ID: " + id_atividade);
        }
        atividadeRepository.deleteById(id_atividade);
    }

    private void validateAtividade(AtividadeDTO atividade) {
        if (atividade.getTitulo() == null || atividade.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("O título da atividade é obrigatório.");
        }
        if (atividade.getTitulo().length() > 100) {
            throw new IllegalArgumentException("O título da atividade não pode exceder 100 caracteres.");
        }

        if (atividade.getDescricao() != null && atividade.getDescricao().length() > 200) {
            throw new IllegalArgumentException("A descrição da atividade não pode exceder 200 caracteres.");
        }

        if (atividade.getLimite_vagas() != null && atividade.getLimite_vagas() < 0) {
            throw new IllegalArgumentException("O limite de vagas não pode ser negativo.");
        }

        if (atividade.getLink_transmissao_atividade() != null && atividade.getLink_transmissao_atividade().length() > 100) {
            throw new IllegalArgumentException("O link de transmissão não pode exceder 100 caracteres.");
        }

        if (atividade.getCarga_horaria() != null && atividade.getCarga_horaria() < 0) {
            throw new IllegalArgumentException("A carga horária não pode ser negativa.");
        }

        if (atividade.getId_evento() == null) {
            throw new IllegalArgumentException("O ID do evento é obrigatório.");
        }
        if (atividade.getId_tipoAtividade() == null) {
            throw new IllegalArgumentException("O ID do tipo de atividade é obrigatório.");
        }

        if (eventoRepository.findById(atividade.getId_evento()).isEmpty()) {
            throw new IllegalArgumentException("O evento com o ID " + atividade.getId_evento() + " não existe.");
        }
    }
}