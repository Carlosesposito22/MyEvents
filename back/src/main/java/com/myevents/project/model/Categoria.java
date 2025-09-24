package com.myevents.project.model;

import lombok.Data;

@Data
public class Categoria {
    private int id_categoria;
    private String nome;
    private String descricao;
    private int id_categoria_pai;
}
