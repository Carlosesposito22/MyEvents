package com.myevents.project.dto.entrega4;

import lombok.Data;

@Data
public class ViewGradeAtividadeDTO {
    private Integer id_evento;
    private String Evento;
    private String Atividade;
    private String DescricaoAtividade;
    private Integer carga_horaria;
    private String TipoAtividade;
    private String Palestrante;
    private String BioPalestrante;
    private String linkedin;
}
