package com.myevents.project.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventoComCategoriaDTO {
    private int id_evento;
    private String titulo;
    private Integer carga_horaria;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private String nome_categoria;
}
