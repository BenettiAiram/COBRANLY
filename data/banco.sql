-- Deleta o banco de dados 
DROP DATABASE COBRANLY;

-- Cria o banco de dados sistema_trocas
CREATE DATABASE IF NOT EXISTS COBRANLY;

-- UTILIZA O BANCO CRIADO PARA CRIAÇÃO DAS TABELAS
USE COBRANLY;

-- Tabela usuários 
CREATE TABLE usuario(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    email_usuario VARCHAR(50) NOT NULL,
    senha_usuario VARCHAR(100) NOT NULL,
    cargo ENUM('administrador', 'cobrador')
);

-- Tabela empresa 
CREATE TABLE empresa(
	id_empresa INT AUTO_INCREMENT PRIMARY KEY,
	nome_empresa VARCHAR(50),
	email_empresa VARCHAR(50) NOT NULL,
	encarregado_empresa VARCHAR(50),
	CNPJ_empresa VARCHAR(18) NOT NULL,
    telefoneResidencial_empresa VARCHAR(20),
    telefoneComercial_empresa VARCHAR(20),
    CEP_empresa VARCHAR(10),
	bairro_empresa VARCHAR(150),
	cidade_empresa VARCHAR(150),
    estado_empresa VARCHAR(150)

);

-- Tabela cliente 
CREATE TABLE cliente(
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(50),
    CPF_cliente VARCHAR(14) NOT NULL, 
    telefone_cliente VARCHAR(20) NOT NULL,
    email_cliente VARCHAR(50) NOT NULL,
    CEP_cliente VARCHAR(10),
	bairro_cliente VARCHAR(150),
    cidade_cliente VARCHAR(150),
    estado_cliente VARCHAR(150),
    banco_cliente VARCHAR(45),
    agência_cliente VARCHAR(150),
    contaCorrente_cliente VARCHAR(45) NOT NULL,

	empresa_id_empresa INT NOT NULL,
    
	CONSTRAINT fk_cliente_empresa
    FOREIGN KEY (empresa_id_empresa)
    REFERENCES empresa (id_empresa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Tabela cobrança 
CREATE TABLE cobranca(
	id_cobranca INT AUTO_INCREMENT PRIMARY KEY,
    valor_divida DECIMAL(10,2),
    status_cobranca VARCHAR(45),
    juros_cobranca VARCHAR(45),
    multas_cobranca VARCHAR(45),
    data_vencimento DATE,
    data_criacao DATE,
    
	empresa_id_empresa INT NOT NULL, 
    
    cliente_id_cliente INT NOT NULL,
    
	CONSTRAINT fk_cobranca_empresa
    FOREIGN KEY (empresa_id_empresa)
    REFERENCES empresa (id_empresa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    
	CONSTRAINT fk_cobranca_cliente
    FOREIGN KEY (cliente_id_cliente)
    REFERENCES cliente (id_cliente)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Administrador
INSERT INTO usuario (
    email_usuario,
    senha_usuario,
    cargo
)
VALUES (
    'admin@gmail.com',
    '$2a$10$XJw2ibichDobFpLhgCGTWeRm21tHiv9YSX7vZoJg1FhECsPDhoxzO',
    'administrador'
);

-- Cobrador
INSERT INTO usuario (
    email_usuario,
    senha_usuario,
    cargo
)
VALUES (
    'cobrador@gmail.com',
    '$2a$10$hN/Ipoo9ZqWUqdk1ZoEto.gMPzdblS9MG2uFPgIjXe8yE3CbJ2bdu',
    'cobrador'
);