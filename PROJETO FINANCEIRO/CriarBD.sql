CREATE TABLE movimentacao(
	id_mov INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    periodo DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DOUBLE(10,2) NOT NULL,
    tipo CHAR(1) NOT NULL
);

CREATE TABLE contas(
	id_conta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome VARCHAR(30) NOT NULL,
    saldo DOUBLE(10,2) NOT NULL    
);

select * from movimentacao;
describe movimentacao;
select * from contas;

ALTER TABLE movimentacao ADD fk_id_conta INT;
ALTER TABLE movimentacao ADD FOREIGN KEY (fk_id_conta) REFERENCES contas (id_conta);

ALTER TABLE movimentacao MODIFY fk_id_conta INT NOT NULL;

insert into contas values(1,'Conta Corrente', 0);
insert into contas values(2,'Poupança', 0);
insert into contas values(4,'Espécie', 0);
