var ox = "X";

    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'submit';
    button.value = 'Submit';
    button.className = 'btn';

        let coisa = window.document.getElementById('tab1');
        coisa.innerHTML = "coisa";
for(let i=0; i<3;i++){
    for(let j=0; j<3; j++){
        
    }
}


function exemplo(){
    let texto = window.document.getElementById('teste');
    console.log(texto.innerHTML);
    texto.innerHTML = "mudança"

}

function marcar(elemento){
    if (ox === "X"){
        ox = "O"
    }else {
        ox = "X"
    }
    console.log(elemento.innerHTML);
    elemento.value = "O";
}