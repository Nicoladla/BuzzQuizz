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
let quizzAtual;
function irPraTelaDoQuizz(idDoQuizz){
    quizzAtual= idDoQuizz;

    const telaInicial= document.querySelector(".tela1-inicial");
    const telaExibiçaoQuizz= document.querySelector(".tela2-exibir_quizz");

    telaInicial.classList.add("oculto");
    telaExibiçaoQuizz.classList.remove("oculto");

    const promessa= axios.get(`${API}/${idDoQuizz}`);
    promessa.then(renderizarTelaQuizz);
}

let perguntasEresultado;
let exibirTitulo;
let niveisDeAcerto;
function renderizarTelaQuizz(quizz){
    niveisDeAcerto= quizz.data.levels;

    perguntasEresultado= document.querySelector(".tela2-exibir_quizz main");
    exibirTitulo= document.querySelector(".titulo-do-quizz");
    let titulosDasPergutas;
    const numeroDeAlternativas= [];

    exibirTitulo.innerHTML= `
        <img src="${quizz.data.image}" alt="quizz">
        <div></div>
        <h1>${quizz.data.title}</h1>
    `;

    //Nesse local é onde é adicionado cada uma das perguntas, e é adicionado uma cor ao titulo.
    perguntasEresultado.innerHTML= "";

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

    //Após execultado essa função, a tela sera scrollada para a primeira pergunta.
    setTimeout(scrollarPraProxPergunta, 2000);
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
}

//Essa é a parte em que o usuário seleciona uma resposta e descobre se ele acertou.
    //Essa é a variável que pega todos os filhos do elemento main.
let arrayDePerguntas;
let contador= 0;

function scrollarPraProxPergunta(){
    arrayDePerguntas= perguntasEresultado.children;

    //Aqui, vai ser scrolado pergunta por pergunta, de acordo for respondendo.    
    if(contador < arrayDePerguntas.length){
        arrayDePerguntas[contador].scrollIntoView();
        contador++;
    }else{
        contador= 0;
        exibirResultadoDoQuizz();
    }
}

let numeroDeAcertos= 0;
function escolherAlternativa(alternativaSelecionada){
    const alternativas= alternativaSelecionada.parentNode;
    
    //Aqui é verificado se a pergunta já teve alguma alternativa selecionada;
    if(alternativas.querySelector(".desfocar") === null){
        
        //Aqui é selcionado a alternativa clicada.
        for(let i=0; i<alternativas.children.length; i++){

            if(alternativas.children[i] !== alternativaSelecionada){
                alternativas.children[i].classList.add("desfocar");
            }

            alternativas.children[i].children[1].classList.remove("cor-padrao");
        }

        //Aqui é verificado se a alternativa clicada é a resposta certa. 
        if(alternativaSelecionada.children[1].classList.value === "res-certa"){
            numeroDeAcertos++;
        }
        setTimeout(scrollarPraProxPergunta, 2000);
    }
}

let caixaDeResultado;
function exibirResultadoDoQuizz(){
    const resultadoDeAcertos= (numeroDeAcertos / arrayDePerguntas.length)*100;
    const porcentagemDeAcertos= Math.round(resultadoDeAcertos);
    let descriçãoDoResultado;

    for(let i=0; i<niveisDeAcerto.length; i++){
        if(porcentagemDeAcertos >= niveisDeAcerto[i].minValue){
            descriçãoDoResultado= niveisDeAcerto[i];
        }
    }

    perguntasEresultado.innerHTML+= `
        <aside class="resultado-quizz">
            <header>${porcentagemDeAcertos}% de acerto: ${descriçãoDoResultado.title}</header>
            <figure>
                <img src="${descriçãoDoResultado.image}" alt="quizz">
                <figcaption>${descriçãoDoResultado.text}</figcaption>
            </figure>
        </aside>
    `;

    caixaDeResultado= perguntasEresultado.querySelector(".resultado-quizz");
    caixaDeResultado.scrollIntoView();

    numeroDeAcertos= 0;
}

function voltarPraTelaInicial(){
    window.location.reload();
}

function reiniciarQuizz(){
    contador= 0;
    numeroDeAcertos= 0;

    exibirTitulo.scrollIntoView();
    irPraTelaDoQuizz(quizzAtual);
}

//--------------------------------------------

let objQuizz = {
    title: undefined,
    image: undefined,
    questions:[],
    levels:[]
 }
 let numQuestions;
 let numLevels;
 let setQuestions = '';
 const createAquizz = document.querySelector('.createAquizz');

function getBasicInfoValues(){
    const tituloNovoQuizz = document.querySelector('.basicInfo .title').value;
    const imageNovoQuizz = document.querySelector('.basicInfo .image').value;
    const numQuestionsNovoQuizz = Number(document.querySelector('.basicInfo .questionNumber').value);
    const numLevelsNovoQuizz = Number(document.querySelector('.basicInfo .levelNumber').value);

    /* validação do número de caracteres do título */
    if(tituloNovoQuizz.length < 20 || tituloNovoQuizz.length >65){
        alert('Por favor, preencha corretamente o título de seu novo quizz')
    }else{
        objQuizz.title = tituloNovoQuizz;
    }
    /* validação da URL */
    if(!isValidUrl(imageNovoQuizz)){
        alert('Por favor, insira uma URL válida para a capa de seu novo quizz')
    }else{
        objQuizz.image = imageNovoQuizz;
    }
    /* validação do numero de perguntas */
    if(numQuestionsNovoQuizz >= 3 && numQuestionsNovoQuizz !== NaN){
        numQuestions = numQuestionsNovoQuizz;
    }else{
        alert('Olá, o número mínimo de perguntas de seu novo quizz deve ser 3')
    }
    /* validação do numero de níveis */
    if(numLevelsNovoQuizz >= 2 && numLevelsNovoQuizz !== NaN){
        numLevels = numLevelsNovoQuizz;
    }else{
        alert('Olá, o número mínimo de níveis de seu novo quizz deve ser 2')
    }
    
    console.log(objQuizz.title)
    console.log(objQuizz.image)
    console.log(numQuestions)
    console.log(numLevels)

}
/* criação da função para validação da URL*/
const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

function resetinnerHTML (){
    createAquizz.innerHTML = ''
}



function createQuestions(){

    let hiddenQuestions = ``

    if( objQuizz.title !== undefined &&  objQuizz.image !== undefined && numQuestions !== undefined && numLevels !== undefined){
        resetinnerHTML()

        for(let i = 1; i < numQuestions ; i++){
            hiddenQuestions = hiddenQuestions + `
            <div class="createQuestions" onclick = "expand(this)">
                <ion-icon class = "ionicon" name="create-sharp"></ion-icon>
                <h2 class = "apparent">Pergunta ${i+1}</h2>
                    <div class = "reduced">
                        <input type="text" class="theQuestion${i+1}" placeholder="Texto da pergunta">
                        <input type="text" class="questionColor${i+1}" placeholder="Cor de fundo da pergunta">
                        <h2 class = "nonapparent">Resposta correta</h2>
                        <input type="text" class="correctAnswer${i+1}" placeholder="Resposta correta">
                        <input type="text" class="correctImage${i+1}" placeholder="URL da imagem">
                        <h2 class = "nonapparent">Respostas incorretas</h2>
                        <input type="text" class="incorrectAnswer${i+1}-1" placeholder="Resposta incorreta 1">
                        <input type="text" class="wrongImage${i+1}-1" placeholder="URL da imagem 1">
                        <input type="text" class="incorrectAnswer${i+1}-2" placeholder="Resposta incorreta 2">
                        <input type="text" class="wrongImage${i+1}-2" placeholder="URL da imagem 2">
                        <input type="text" class="incorrectAnswer${i+1}-3" placeholder="Resposta incorreta 3">
                        <input type="text" class="wrongImage${i+1}-3" placeholder="URL da imagem 3">
                    </div>    
            </div>`;
        }

        console.log(numQuestions)
        createAquizz.innerHTML = createAquizz.innerHTML + `
        <h1>Crie suas perguntas</h1>
        <div class="createQuestions">
                    <h2>Pergunta 1</h2>
                    <input type="text" class="theQuestion1" placeholder="Texto da pergunta">
                    <input type="text" class="questionColor1" placeholder="Cor de fundo da pergunta">
                    <h2>Resposta correta</h2>
                    <input type="text" class="correctAnswer1" placeholder="Resposta correta">
                    <input type="text" class="correctImage1" placeholder="URL da imagem">
                    <h2>Respostas incorretas</h2>
                    <input type="text" class="incorrectAnswer1-1" placeholder="Resposta incorreta 1">
                    <input type="text" class="wrongImage1-1" placeholder="URL da imagem 1">
                    <input type="text" class="incorrectAnswer1-2" placeholder="Resposta incorreta 2">
                    <input type="text" class="wrongImage1-2" placeholder="URL da imagem 2">
                    <input type="text" class="incorrectAnswer1-3" placeholder="Resposta incorreta 3">
                    <input type="text" class="wrongImage1-3" placeholder="URL da imagem 3">
        </div>
        ${hiddenQuestions}
        <button class="proceedTolevels" onclick = "getQuestionValues()">Prosseguir pra criar níveis</button>`;

        }
        
}

function expand(botao){
    const reduced =  document.querySelector('.reduced');
    reduced.classList.remove('reduced');
    reduced.classList.add('expanded');
}

var reg=/^#([0-9a-f]{3}){1,2}$/i; //https://www.codegrepper.com/code-examples/javascript/javascript+check+if+string+is+valid+hex+color


function getQuestionValues(){
     
    for(let j = 1 ; j <= numQuestions ; j++){
        let objQuestion = {
            title: undefined,
            color: undefined,
            answers:[]
        }; 

        let titleNewQuestion = document.querySelector(`.theQuestion${j}`).value;

        if(titleNewQuestion.length < 20 ){
            alert('Olá! Sua pergunta deve ter ao menos 20 caracteres!')
        }else{
            objQuestion.title = titleNewQuestion;
        }

        let colorNewQuestion = document.querySelector(`.questionColor${j}`).value;

        if(reg.test(colorNewQuestion) === false){
            alert('Olá! Por favor insira um código de cor hexadecimal válido!')
        }else{
            objQuestion.color = colorNewQuestion;
        }
        
        let theCorrectAnswer = document.querySelector(`.correctAnswer${j}`).value;
        let theCorrectImage = querySelector(`.correctImage${j}`).value;

        if (!isValidUrl(theCorrectImage) || theCorrectAnswer.length < 1){
            alert('Olá! Por favor preencha corretamente o campo de reposta!')
        }else{
            const theCorrect = {
                text: theCorrectAnswer,
                image: theCorrectImage,
                isCorrectAnswer: true
            };
            objQuestion.answers.push(theCorrect);
        }

        let theinorrectAnswer1 = document.querySelector(`.incorrectAnswer${j}-1`).value;
        let theinorrectImage1 = document.querySelector(`.wrongImage${j}-1`).value;
        
        if (!isValidUrl(theinorrectImage1) || theinorrectAnswer1.length < 1){
            alert('Olá! Por favor preencha corretamente o campo de reposta!')
        }else{
            const theIncorrect1 = {
                text: theinorrectAnswer1,
                image: theinorrectImage1,
                isCorrectAnswer: false
            };
            objQuestion.answers.push(theIncorrect1);
        }

        const theIncorrect2 = {
            text: document.querySelector(`.incorrectAnswer${j}-2`).value,
            image: document.querySelector(`.wrongImage${j}-2`).value,
            isCorrectAnswer: false
        };
        objQuestion.answers.push(theIncorrect2);

        const theIncorrect3 = {
            text: document.querySelector(`.incorrectAnswer${j}-3`).value,
            image: document.querySelector(`.wrongImage${j}-3`).value,
            isCorrectAnswer: false
        };
        objQuestion.answers.push(theIncorrect3);
        objQuizz.questions.push(objQuestion);
    }

    console.log(objQuizz.questions);
} 
/* ======= */

