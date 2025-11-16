package com.myevents.project.service;

import com.myevents.project.dto.EventoComCategoriaDTO;
import com.myevents.project.dto.EventoDTO;
import com.myevents.project.model.Evento;
import com.myevents.project.repository.CategoriaRepository;
import com.myevents.project.repository.ConsultaRepository;
import com.myevents.project.repository.EventoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ConsultaRepository consultaRepository;

    public EventoService(EventoRepository eventoRepository, CategoriaRepository categoriaRepository, ConsultaRepository consultaRepository) {
        this.eventoRepository = eventoRepository;
        this.categoriaRepository = categoriaRepository;
        this.consultaRepository = consultaRepository;
    }

    public Optional<Evento> findById(int id_evento) {
        return eventoRepository.findById(id_evento);
    }

    public List<Evento> findByTituloContaining(String titulo) {
        return eventoRepository.findByTituloContaining(titulo);
    }

    public List<Evento> findByDataBetween(LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("As datas de início e fim do filtro são obrigatórias.");
        }
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("A data de início do filtro não pode ser posterior à data de fim.");
        }
        return eventoRepository.findByDataBetween(dataInicio, dataFim);
    }

    public List<EventoComCategoriaDTO> findEventosByCategoriaId(int id_categoria) {
        if (categoriaRepository.findById(id_categoria).isEmpty()) {
            throw new RuntimeException("A categoria com o ID " + id_categoria + " não existe.");
        }
        return eventoRepository.findEventosByCategoriaId(id_categoria);
    }

    public void save(EventoDTO evento) {
        validateEvento(evento);
        eventoRepository.save(evento);
    }

    @Transactional
    public void update(int id_evento, EventoDTO eventoDTO) {
        Optional<Evento> eventoBDOpt = eventoRepository.findById(id_evento);
        if (eventoBDOpt.isEmpty()) {
            throw new RuntimeException("Evento não encontrado com o ID: " + id_evento);
        }
        validateEvento(eventoDTO);

        Evento eventoBD = eventoBDOpt.get();
        boolean mudouTitulo = !eventoBD.getTitulo().equals(eventoDTO.getTitulo());
        boolean mudouLimite = eventoBD.getLimite_participantes() != eventoDTO.getLimite_participantes();

        if (mudouTitulo || mudouLimite) {
            // Se mudou título ou limite, chama procedure
            consultaRepository.atualizarEventoAuditado(id_evento, eventoDTO.getTitulo(), eventoDTO.getLimite_participantes());
            // Faz update dos outros campos, sem atualizar titulo e limite
            eventoRepository.updateWithoutTituloLimite(id_evento, eventoDTO);
        } else {
            // Só campos comuns, update puro normal
            eventoRepository.updateWithoutTituloLimite(id_evento, eventoDTO);
        }
    }

    public void deleteById(int id_evento) {
        if (eventoRepository.findById(id_evento).isEmpty()) {
            throw new RuntimeException("Evento não encontrado com o ID: " + id_evento);
        }
        eventoRepository.deleteById(id_evento);
    }

    private void validateEvento(EventoDTO evento) {
        if (evento.getTitulo() == null || evento.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("O título do evento é obrigatório.");
        }
        if (evento.getTitulo().length() > 300) {
            throw new IllegalArgumentException("O título do evento não pode exceder 300 caracteres.");
        }
        if (evento.getData_inicio() != null && evento.getData_fim() != null) {
            if (evento.getData_fim().isBefore(evento.getData_inicio())) {
                throw new IllegalArgumentException("A data de fim não pode ser anterior à data de início.");
            }
        }
        if (evento.getId_categoria() == null) {
            throw new IllegalArgumentException("O ID da categoria é obrigatório.");
        }
        if (categoriaRepository.findById(evento.getId_categoria()).isEmpty()) {
            throw new IllegalArgumentException("A categoria com o ID " + evento.getId_categoria() + " não existe.");
        }
        if (evento.getCarga_horaria() != null && evento.getCarga_horaria() < 0) {
            throw new IllegalArgumentException("A carga horária não pode ser negativa.");
        }
        if (evento.getLimite_participantes() < 0) {
            throw new IllegalArgumentException("O limite de participantes não pode ser negativo.");
        }
        if (evento.getEmail_duvidas() != null && !evento.getEmail_duvidas().trim().isEmpty()) {
            String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
            if (!evento.getEmail_duvidas().matches(emailRegex)) {
                throw new IllegalArgumentException("O formato do e-mail para dúvidas é inválido.");
            }
        }
    }
}