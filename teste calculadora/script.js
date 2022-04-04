teste = document.getElementById('conta');

var tela = document.getElementById('display');
var ent;
var memoria;
var comvirgula = false;
var operacao;
var resultado;
var novodigito;


//recebe os  números digitados
function num(valor){      
    //reconhece nova operação
    if(operacao == undefined && !novodigito && memoria !=undefined){
        zerar();
    } 

    //remove o zero do início do número
    if(!novodigito){
        tela.innerHTML="0"
    }
    if(parseFloat(tela.innerHTML) == 0 && !comvirgula){
        tela.innerHTML='';
        tela.innerHTML = valor;
        novodigito = true

    //verifica o limite de dígitos 
    }else if(tela.innerHTML.length<=9){
        tela.innerHTML += valor;
        novodigito = true;

    } else{
        window.alert('limite de dígitos atingido');
    }
}

//adiciona a virgula ao numero
function virgula(){
    if(tela.innerHTML.indexOf('.') == -1){
        tela.innerHTML += '.';
        comvirgula = true;
    }
}

//zera tudo na calculadora
function zerar(){
    ent = undefined;
    memoria = undefined;
    comvirgula = false;
    operacao = undefined;
    resultado = undefined;
    tela.innerHTML = '0';
}

//operação

function op(operador){
    //armazena o valor da tela em uma variavel adequada
    if(novodigito){
        if(memoria == undefined){
            memoria = tela.innerHTML;
        } else{
            ent =tela.innerHTML;
        }
        
        novodigito = false;    
        res();
    }


    this.operacao = operador;
    comvirgula = false;
}

function res(){
    if(novodigito){
        if(memoria == undefined){
            memoria = tela.innerHTML;
        } else{
            ent =tela.innerHTML;
        }
        novodigito = false;    
    }
    if(ent != undefined){
        switch(operacao){
            case('+'):
                resultado = parseFloat(memoria) + parseFloat(ent);
            break;
            case('-'):
                resultado = parseFloat(memoria) - parseFloat(ent);
            break
            case('*'):
                resultado = parseFloat(memoria) * parseFloat(ent);
            break;
            case('/'):
                resultado = parseFloat(memoria) / parseFloat(ent);
            break;
        }

        if(resultado != undefined){
            teste.innerHTML= ` ${memoria} ${operacao} ${ent} = ${resultado}   `;
            memoria = resultado;
            tela.innerHTML = resultado;
            ent = undefined;
            operacao = undefined;
        }
    }
}