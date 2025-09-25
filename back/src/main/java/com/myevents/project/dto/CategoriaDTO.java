package com.myevents.project.dto;

import lombok.Data;

@Data
public class CategoriaDTO {
    private String nome;
    private String descricao;
    private Integer id_categoria_pai;
}
