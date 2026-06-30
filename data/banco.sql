-- Deleta o banco de dados 
DROP DATABASE IF EXISTS COBRANLY;

-- Cria o banco de dados sistema_trocas
CREATE DATABASE IF NOT EXISTS COBRANLY;

-- UTILIZA O BANCO CRIADO PARA CRIAÇÃO DAS TABELAS
USE COBRANLY;

-- Tabela usuários 
CREATE TABLE usuarios(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(50) NOT NULL UNIQUE,
    senha_usuario VARCHAR(100) NOT NULL,
    telefone_usuario VARCHAR(20) NOT NULL UNIQUE,
    foto_usuario VARCHAR(255),
    cargo ENUM('administrador', 'cobrador', 'devedor') NOT NULL
);

-- Tabela empresa 
CREATE TABLE empresa(
	id_empresa INT AUTO_INCREMENT PRIMARY KEY,
	nome_empresa VARCHAR(50) NOT NULL UNIQUE,
	email_empresa VARCHAR(50) NOT NULL UNIQUE,
	encarregado_empresa INT NOT NULL,
	CNPJ_empresa VARCHAR(18) NOT NULL UNIQUE,
    telefoneComercial_empresa VARCHAR(20) NOT NULL UNIQUE,
	bairro_empresa VARCHAR(150) NOT NULL,
	cidade_empresa VARCHAR(150) NOT NULL,
    estado_empresa VARCHAR(150) NOT NULL,
    FOREIGN KEY (encarregado_empresa)
    REFERENCES usuarios (id_usuario)
);


-- Tabela cobrança 
CREATE TABLE cobranca(
	id_cobranca INT AUTO_INCREMENT PRIMARY KEY,
    valor_divida DECIMAL(10,2) NOT NULL,
    status_cobranca VARCHAR(45) NOT NULL,
    juros_cobranca VARCHAR(45) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_criacao DATE NOT NULL,
	empresa_id_empresa INT NOT NULL, 
    usuario_id_usuario INT NOT NULL,
	CONSTRAINT fk_cobranca_empresa
    FOREIGN KEY (empresa_id_empresa)
    REFERENCES empresa (id_empresa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    
	CONSTRAINT fk_cobranca_usuario
    FOREIGN KEY (usuario_id_usuario)
    REFERENCES usuarios (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Administrador
INSERT INTO usuarios (
    nome_usuario,
    email_usuario,
    senha_usuario,
    telefone_usuario,
    cargo
)
VALUES (
    'Helena',
    'administrador@gmail.com',
    '$2a$10$G4McQ/tMSUi6QZgzribY0uM7O/x/ofNJTwIIdMfhmqvM6p5ATpDyS',
    '12345678910',
    'administrador'
);

-- Cobrador
INSERT INTO usuarios (
    nome_usuario,
    email_usuario,
    senha_usuario,
    telefone_usuario,
    cargo
)
VALUES (
    'Ravi',
    'cobrador@gmail.com',
    '$2a$10$G4McQ/tMSUi6QZgzribY0uM7O/x/ofNJTwIIdMfhmqvM6p5ATpDyS',
    '12345678911',
    'cobrador'
);

-- Devedor
INSERT INTO usuarios (
    nome_usuario,
    email_usuario,
    senha_usuario,
    telefone_usuario,
    cargo
)
VALUES (
    'Lucas',
    'devedor@gmail.com',
    '$2a$10$G4McQ/tMSUi6QZgzribY0uM7O/x/ofNJTwIIdMfhmqvM6p5ATpDyS',
    '12345678912',
    'devedor'
);


-- Empresa
INSERT INTO empresa (
    nome_empresa,
    email_empresa,
    encarregado_empresa,
    CNPJ_empresa,
    telefoneComercial_empresa,
    bairro_empresa,
    cidade_empresa,
    estado_empresa
) VALUES (
    'Vale',
    'vale@gmail.com',
    '2',
    '33.592.510/0001-54',
    '0800 285 7000',
    ' Polo Industrial de Tubarão',
    'Serra',
    'ES'
);

INSERT INTO empresa (
    nome_empresa,
    email_empresa,
    encarregado_empresa,
    CNPJ_empresa,
    telefoneComercial_empresa,
    bairro_empresa,
    cidade_empresa,
    estado_empresa
) VALUES (
    'Arcelor Mittal',
    'arcelor@gmail.com',
    '2',
    '17.469.701/0001-77',
    '0800 015 1221',
    ' Polo Industrial de Tubarão',
    'Serra',
    'ES'
);

-- Cobranca
INSERT INTO cobranca (
    valor_divida,
    status_cobranca,
    juros_cobranca,
    data_vencimento,
    data_criacao,
    empresa_id_empresa,
    usuario_id_usuario
) VALUES (
    1000.00,
    'pendente',
    '10%',
    '2028-07-01',
    '2025-06-01',
    1,
    3
);

INSERT INTO cobranca (
    valor_divida,
    status_cobranca,
    juros_cobranca,
    data_vencimento,
    data_criacao,
    empresa_id_empresa,
    usuario_id_usuario
) VALUES (
    1500.00,
    'pendente',
    '8%',
    '2027-09-01',
    '2025-04-01',
    2,
    3
);