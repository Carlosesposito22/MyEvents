package com.myevents.project.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Evento {
    private Integer id_evento;
    private String titulo;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private Integer carga_horaria;
    private int limite_participantes;
    private int expectiva_participantes;
    private int numero_participantes;
    private Integer id_categoria;
    private String email_duvidas;
    private int numero_membros_comissao;
}