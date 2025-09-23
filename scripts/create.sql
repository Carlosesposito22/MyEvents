CREATE DATABASE myEvents_db;
USE myEvents_db;

CREATE TABLE Categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    id_categoria_pai INT,
    FOREIGN KEY (id_categoria_pai) REFERENCES Categoria(id_categoria) ON DELETE SET NULL
);

CREATE TABLE Evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(300) NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    carga_horaria INT,
    limite_participantes INT DEFAULT (0),
    expectiva_participantes INT DEFAULT (0),
    numero_participantes INT NOT NULL DEFAULT (0),
    id_categoria INT NOT NULL,
	email_duvidas VARCHAR(100),
    numero_membros_comissao INT NOT NULL DEFAULT (0),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT chk_datas_evento CHECK (data_fim >= data_inicio)
);

CREATE TABLE Local (
    id_local INT PRIMARY KEY AUTO_INCREMENT,
    NomeLocal VARCHAR(100) NOT NULL,
    capacidade INT CHECK (capacidade >= 0),
    rua VARCHAR(100),
    numero INT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10) NOT NULL
);

CREATE TABLE EventoOnline (
    id_evento INT PRIMARY KEY,
    url_evento VARCHAR(200) NOT NULL UNIQUE,
    aplicativoTrasmissao VARCHAR(50),
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento) ON DELETE CASCADE
);

CREATE TABLE EventoPresencial (
    id_evento INT PRIMARY KEY,
    id_local INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_local) REFERENCES Local(id_local) ON DELETE RESTRICT
);

CREATE TABLE TipoAtividade (
    id_tipoAtividade INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(200)
);

CREATE TABLE Atividade (
    id_atividade INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(200),
    limite_vagas INT CHECK (limite_vagas >= 0),
    link_transmissao_atividade VARCHAR(100) NULL UNIQUE,
    carga_horaria INT,
    id_evento INT NOT NULL,
    id_tipoAtividade INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_tipoAtividade) REFERENCES TipoAtividade(id_tipoAtividade) ON DELETE RESTRICT
); 

CREATE TABLE Palestrante (
    id_palestrante INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    biografia VARCHAR(1000),
    linkedin VARCHAR(100) UNIQUE,
    lattes VARCHAR(100) UNIQUE
);

CREATE TABLE Especialidade (
    id_especialidade INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Palestrante_Especialidade (
    id_palestrante INT NOT NULL,
    id_especialidade INT NOT NULL,
    PRIMARY KEY (id_palestrante, id_especialidade),
    FOREIGN KEY (id_palestrante) REFERENCES Palestrante(id_palestrante) ON DELETE CASCADE,
    FOREIGN KEY (id_especialidade) REFERENCES Especialidade(id_especialidade) ON DELETE RESTRICT
);

CREATE TABLE Apresentacao (
    id_palestrante INT NOT NULL,
    id_atividade INT NOT NULL,
    PRIMARY KEY (id_palestrante, id_atividade),
    FOREIGN KEY (id_palestrante) REFERENCES Palestrante(id_palestrante) ON DELETE CASCADE,
    FOREIGN KEY (id_atividade) REFERENCES Atividade(id_atividade) ON DELETE CASCADE
);

CREATE TABLE MaterialDeApoio (
    id_material INT PRIMARY KEY AUTO_INCREMENT,
    tipo_arquivo VARCHAR(50),
    url_do_arquivo VARCHAR(100) NOT NULL UNIQUE,
    id_palestrante INT NOT NULL,
    id_atividade INT NOT NULL,
	FOREIGN KEY (id_palestrante, id_atividade) REFERENCES Apresentacao(id_palestrante, id_atividade) ON DELETE CASCADE
);