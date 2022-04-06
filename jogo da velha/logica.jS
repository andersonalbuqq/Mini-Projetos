// Criação de um array de array's para armazenar cada uma das posições do tabuleiro.
let casas = [[],[],[]];
casas[0].push(document.getElementById('supEsq'));
casas[0].push(document.getElementById('supCen'));
casas[0].push(document.getElementById('supDir'));
casas[1].push(document.getElementById('cenEsq'));
casas[1].push(document.getElementById('cenCen'));
casas[1].push(document.getElementById('cenDir'));
casas[2].push(document.getElementById('infEsq'));
casas[2].push(document.getElementById('infCen'));
casas[2].push(document.getElementById('infDir'));

// variaveis de controle, para verificação se o jogo deve continuar.
let ganhador;
let venceu, empate; 

//inicialização das variaveis.
if(OX === undefined || venceu === undefined){
    venceu = false;
    empate = false;
    var OX = "X";
}

//Logica para marca uma casa do tabuleiro.
function marcar(elemento){
    //Verificação se já houve um vencedor.
    if(venceu){    
        escrever("A partida ja acabou. E o jogador '" + ganhador + "' venceu. Parabéns!!!")
    //Verificação se houve um empate.
    } else if(empate){
        escrever("A partida ja acabou e houve um empate")
    }else{
        //Controle de qual jogador da vez O/X.      
        if(elemento.value == ""){
            if(OX == "X"){
                elemento.value = OX;
                ganhador = OX;
                OX = "O";
            }else {
                elemento.value = OX;
                ganhador = OX;
                OX = "X";
            }
            verificar(ganhador);
        }
    }
}
// Função responsável por reinicializar todo o tabuleiro.
function zerar(){
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            casas[i][j].value = "";
        }
    }
    venceu = false;
    empate = false;
    escrever("");
}

//Verificação se houve um ganhador ou empate.
function verificar(jogador){
    
    //caso haja vitória em uma linha.
    for(let i=0; i<3; i++){
            if(casas[i][0].value !=="" && casas[i][0].value === casas[i][1].value && casas[i][0].value === casas[i][2].value){
                venceu = true;
            }
    }

    //caso haja vitória em uma coluna.
    for(let i=0; i<3; i++){
        if(casas[0][i].value !=="" && casas[0][i].value === casas[1][i].value && casas[0][i].value === casas[2][i].value){
            venceu = true;
        }
    }

    //caso haja vitória na diagonal principal.
    if(casas[0][0].value !== "" && casas[0][0].value === casas[1][1].value && casas[0][0].value === casas[2][2].value){
        venceu = true;
    }

    //caso haja vitória na diagonal secundária.
    if(casas[0][2].value !== "" && casas[0][2].value === casas[1][1].value && casas[0][2].value === casas[2][0].value){
        venceu = true;
    }

    //exibição de mensagem de vitória
    if(venceu){
        escrever("O jogador '" + ganhador + "' venceu. Parabéns!!!")
    }

    //Verifica se houve empate
    empate = true;
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(casas[i][j].value !== "O" && casas[i][j].value !== "X" ){
                empate = false;
            }
        }
    }

    //exibe mensagem de empate.
    if(empate && !venceu){
        escrever("A partida acabou empatada")
    }
}

function escrever(texto){
    let local = window.document.getElementById('destaque');
    local.innerHTML = texto;
}
