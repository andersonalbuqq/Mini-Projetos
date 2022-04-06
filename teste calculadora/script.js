displayCompleto = document.getElementById('conta'); //variavel para apontar para o display que exibe a conta por inteiro

var tela = document.getElementById('display');   // variavel para apontar para o display básico

var ent;
var memoria;
var comvirgula = false;  //informa se o número possui virgulas
var operacao;   //Operação a ser realizada
var resultado;
var temdigito;  //armazena se existe no display básico um valor que ainda não foi usado


    //recebe os  números digitados e os exibe no display básico
function num(valor){      
        //reconhece se foi inserida nova operação
    if(operacao == undefined && !temdigito && memoria !=undefined){
        zerar();
    } 

        //Reseta o display para o valor de zero após inserida nova operação ou exibir resultado
    if(!temdigito){
        tela.innerHTML="0"
    }

        //remove a repetição dos zeros como primero número
    if(parseFloat(tela.innerHTML) == 0 && !comvirgula){
        tela.innerHTML = valor;
        temdigito = true

            //verifica o limite de dígitos e constroi o numero inserido
        }else if(tela.innerHTML.length<=9){
            tela.innerHTML += valor;
            temdigito = true;

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

        //verifica se já existe alguma operação cadastrada e armazena o valor da tela em uma variavel adequada
    if(temdigito){
        if(memoria == undefined){
            memoria = tela.innerHTML;
        } else{
            ent =tela.innerHTML;
        }
        
        temdigito = false;    
        res();
    }

    this.operacao = operador;
    comvirgula = false;
}

function res(){
    if(temdigito){
        if(memoria == undefined){
            memoria = tela.innerHTML;
        } else{
            ent =tela.innerHTML;
        }
        temdigito = false;    
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
            displayCompleto.innerHTML= ` ${memoria} ${operacao} ${ent} = ${resultado}   `;
            memoria = resultado;
            tela.innerHTML = resultado;
            ent = undefined;
            operacao = undefined;
        }
    }
}