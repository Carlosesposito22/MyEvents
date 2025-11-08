package com.myevents.project.dto.entrega4;

import lombok.Data;

@Data
public class LocalNaoUtilizadoDTO {
    private Integer id_local;
    private String NomeLocal;
    private String cidade;
    private Integer capacidade;
}