package com.myevents.project.dto.entrega5;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EventoExclusaoLogDTO {
    private Integer id_log;
    private Integer id_evento;
    private String titulo;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private Integer numero_participantes;
    private Integer limite_participantes;
    private Integer id_categoria;
    private String email_duvidas;
    private Integer numero_membros_comissao;
    private LocalDateTime data_exclusao;
    private String usuario_acao;
}