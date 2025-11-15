package com.myevents.project.dto.entrega5;
import lombok.Data;

@Data
public class EventoAtualizacaoLogDTO {
    private Integer id_evento;
    private String titulo_novo;
    private Integer limite_participantes_novo;
}