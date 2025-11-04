package com.myevents.project.dto;

import lombok.Data;

@Data
public class AtividadeDTO {
    private String titulo;
    private String descricao;
    private Integer limite_vagas;
    private String link_transmissao_atividade;
    private Integer carga_horaria;
    private Integer id_evento;
    private Integer id_tipoAtividade;
}