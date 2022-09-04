//Essa função é utilizada para embaralhar um array.
function embaralharArray(arr){
    for(let i = arr.length-1; i>0; i--){
        let j = Math.floor( Math.random() * (i + 1) );
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
}

//Esse é o link da API do BuzzQuizz
const API= "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

//Essa é a parte em que os quizzes do servidor são renderizados na tela Inicial. 
function buscarQuizzesServidor(){
    const promessa= axios.get(API);
    promessa.then(renderizarQuizzServidor);
}
buscarQuizzesServidor();

function renderizarQuizzServidor(res){
    const quizzServidor= document.querySelector(".quizz-servidor .todos-quizzes");

    quizzServidor.innerHTML= ""

    for(let i=0; i<res.data.length; i++){
        quizzServidor.innerHTML+= `
            <figure id="${res.data[i].id}" onclick="irPraTelaDoQuizz(${res.data[i].id})">
                <img src="${res.data[i].image}" alt="quizz">
                <div></div>
                <figcaption>${res.data[i].title}</figcaption>
            </figure>
        `;
    }
}

//Essa é a parte em que acorre a troca entre a tela inicial e a exibição do quizz.
//Essa também é a parte em que ocorre a criação dinamica da tela de exibição do quizz.
function irPraTelaDoQuizz(idDoQuizz){
    const telaInicial= document.querySelector(".tela1-inicial");
    const telaExibiçaoQuizz= document.querySelector(".tela2-exibir_quizz");

    telaInicial.classList.add("oculto");
    telaExibiçaoQuizz.classList.remove("oculto");

    const promessa= axios.get(`${API}/${idDoQuizz}`);
    promessa.then(renderizarTelaQuizz);
}

function renderizarTelaQuizz(quizz){
    console.log(quizz.data.questions)

    const exibirTitulo= document.querySelector(".titulo-do-quizz");
    const perguntasEresultado= document.querySelector(".tela2-exibir_quizz main");
    let titulosDasPergutas;
    const numeroDeAlternativas= [];

    exibirTitulo.innerHTML= `
        <img src="${quizz.data.image}" alt="quizz">
        <div></div>
        <h1>${quizz.data.title}</h1>
    `;

    //Nesse local é onde é adicionado cada uma das perguntas, e é adicionado uma cor ao titulo.
    for(let i=0; i<quizz.data.questions.length; i++){

        perguntasEresultado.innerHTML+=`
            <section class="pergunta-quizz identificador${i}">
                <header>${quizz.data.questions[i].title}</header>
                <div class="opçao-de-resposta"></div>
            </section>
        `;
        //Aqui é onde é adicionado cor ao titulo
        titulosDasPergutas= document.querySelector(`.identificador${i} header`);
        
        if(quizz.data.questions[i].color === "#ffffff"){
            titulosDasPergutas.style.background= quizz.data.questions[i].color;
            titulosDasPergutas.style.color= "black";
            titulosDasPergutas.style.border= "1px solid #d3d3d3";
        }else{
            titulosDasPergutas.style.background= quizz.data.questions[i].color;
        }

        renderizarAlternativas(quizz.data.questions[i], `.identificador${i}`);
    }
}

function renderizarAlternativas(questao, indentificador){

    const opçãoDeResposta= document.querySelector(`${indentificador} .opçao-de-resposta`);
    const alternativas= [];
    let valorDaAlternativa;

    //Aqui o loop pega as alternativas e armazena em um array para ser embaralhado.
    for(let i=0; i<questao.answers.length; i++){
        alternativas.push(questao.answers[i]);
    }
    embaralharArray(alternativas);

    //Aqui é onde as alternativas serão inceridas no html
    for(let i=0; i<alternativas.length; i++){
        
        if(alternativas[i].isCorrectAnswer === true){
            valorDaAlternativa= "res-certa";
        }else{
            valorDaAlternativa= "res-errada";
        }

        opçãoDeResposta.innerHTML+=`
            <figure onclick="escolherAlternativa(this)">
                <img src="${alternativas[i].image}" alt="quizz">
                <figcaption class="${valorDaAlternativa} cor-padrao">${alternativas[i].text}</figcaption>
            </figure>
        `;
    }

    console.log(alternativas)//
}
//Essa é a parte em que o usuário seleciona uma resposta e descobre se ele acertou.
let contador= 1;
function scrolarPraProxPergunta(){
    //Aqui a variável pega todos os filhos do elemento main.
    const arrayDePerguntas= document.querySelector(".tela2-exibir_quizz main").children;

    //Aqui, vai ser scrolado pergunta por pergunta, de acordo for respondendo
    if(contador < arrayDePerguntas.length){
        arrayDePerguntas[contador].scrollIntoView();
        contador++;
    }else{
        contador= 1;
    }
}

function escolherAlternativa(alternativaSelecionada){
    const alternativas= alternativaSelecionada.parentNode;
    
    //Aqui é verificado se a pergunta já teve alguma alternativa selecionada;
    if(!alternativaSelecionada.classList.contains("desfocar")){
        
        //Aqui é selcionado a alternativa clicada.
        for(let i=0; i<alternativas.children.length; i++){

            if(alternativas.children[i] !== alternativaSelecionada){
                alternativas.children[i].classList.add("desfocar");
            }

            alternativas.children[i].children[1].classList.remove("cor-padrao");
        }

        setTimeout(scrolarPraProxPergunta, 2000);
    }

    console.log(alternativaSelecionada)
    console.log(alternativas.parentNode)
}

{
/* <aside class="resultado-quizz oculto">
    <header>Titulo da pergunta</header>
    <figure>
        <img src="https://static.escolakids.uol.com.br/2019/07/paisagem-natural-e-paisagem-cultural.jpg" alt="quizz">
        <figcaption>
            Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o 
            loop infinito de comida e clique no botão abaixo para 
            usar o vira-tempo e reiniciar este teste.
        </figcaption>
    </figure>
</aside> */
}