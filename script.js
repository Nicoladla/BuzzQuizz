//Esse é o link da API do BuzzQuizz
const API= "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

//Essa é a parte em que os quizzes do servidor são renderizados na tela Inicial. 
function buscarQuizzesServidor(){
    const promessa= axios.get(API);
    promessa.then(renderizarQuizzServidor);
}
buscarQuizzesServidor()

function renderizarQuizzServidor(res){
    const quizzServidor= document.querySelector(".quizz-servidor .todos-quizzes");

    quizzServidor.innerHTML= ""

    for(let i=0; i<res.data.length; i++){
        quizzServidor.innerHTML+= `
            <figure id=${res.data[i].id} onclick="exibirquizz(${res.data[i].id})">
                <img src=${res.data[i].image} alt="quizz">
                <div></div>
                <figcaption>${res.data[i].title}</figcaption>
            </figure>
        `
    }
    console.log(res.data[0])//
}

//Essa é a parte em que acorre a troca entre a tela inicial e a exibição do quizz.
function exibirquizz(idDoQuizz){
    const telaInicial= document.querySelector(".tela1-inicial");
    const telaExibiçaoQuizz= document.querySelector(".tela2-exibir_quizz");

    telaInicial.classList.add("oculto");
    telaExibiçaoQuizz.classList.remove("oculto");
}