package com.myevents.project.model;

import lombok.Data;

@Data
public class Palestrante {
    private Integer id_palestrante;
    private String nome;
    private String email;
    private String biografia;
    private String linkedin;
    private String lattes;
}
