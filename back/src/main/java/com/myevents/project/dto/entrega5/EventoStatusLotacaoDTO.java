package com.myevents.project.dto.entrega4;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EventoStatusLotacaoDTO {
    private Integer id_evento;
    private String nome_evento;
    private LocalDate data_inicio;
    private Integer limite_participantes;
    private Integer numero_participantes;
    private String statusEvento;
}