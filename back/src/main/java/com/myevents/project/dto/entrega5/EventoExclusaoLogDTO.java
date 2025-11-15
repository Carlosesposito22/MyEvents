package com.myevents.project.dto.entrega5;
import lombok.Data;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventoAtualizacaoLogDTO {
    private Integer id_log;
    private Integer id_evento;
    private String campo_alterado;
    private String valor_antigo;
    private String valor_novo;
    private LocalDateTime data_alteracao;
}