package com.myevents.project.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventoDTO {
    private String titulo;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private Integer carga_horaria;
    private int limite_participantes;
    private int expectativa_participantes;
    private int numero_participantes;
    private Integer id_categoria;
    private String email_duvidas;
    private int numero_membros_comissao;
}