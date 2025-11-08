package com.myevents.project.dto.entrega4;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ViewDetalhesEventoDTO {
    private Integer id_evento;
    private String titulo;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private Integer numero_participantes;
    private Integer limite_participantes;
    private Integer carga_horaria;
    private String NomeCategoria;
    private String NomeLocal;
    private String cidade;
    private String estado;
    private String rua;
    private Integer NumeroLocal;
    private String url_evento;
    private String aplicativoTrasmissao;
    private Long qtd_atividades;
    private Long qtd_palestrantes;
}
