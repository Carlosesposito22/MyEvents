package com.myevents.project.dto.entrega5;

import lombok.Data;

@Data
public class RelatorioDetalhadoEventoDTO {
    private Integer id_evento;
    private String titulo;
    private Integer qtd_atividades;
    private String palestrantes;
}