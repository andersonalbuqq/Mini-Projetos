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

let ganhador;
let venceu; 

if(OX === undefined || venceu === undefined){
    venceu = false;
    var OX = "X";
}

function marcar(elemento){
    if(venceu){    
        window.alert("A partida ja acabou. E o jogador '" + ganhador + "' venceu. Parabéns!!!")
    } else{
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

function zerar(){
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            casas[i][j].value = "";
        }
    }
    venceu = false;
}

function verificar(jogador){
    for(let i=0; i<3; i++){
            if(casas[i][0].value !=="" && casas[i][0].value === casas[i][1].value && casas[i][0].value === casas[i][2].value){
                venceu = true;
            }
    }

    for(let i=0; i<3; i++){
        if(casas[0][i].value !=="" && casas[0][i].value === casas[1][i].value && casas[0][i].value === casas[2][i].value){
            venceu = true;
        }
    }

    if(casas[0][0].value !== "" && casas[0][0].value === casas[1][1].value && casas[0][0].value === casas[2][2].value){
        venceu = true;
    }

    if(casas[0][2].value !== "" && casas[0][2].value === casas[1][1].value && casas[0][2].value === casas[2][0].value){
        venceu = true;
    }

    if(venceu){
        window.alert("O jogador '" + ganhador + "' venceu. Parabéns!!!")
    }
}
