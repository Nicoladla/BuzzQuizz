//Essa função é utilizada para embaralhar um array.
 function embaralharArray(arr){
    for(let i = arr.length-1; i>0; i--){
        let j = Math.floor( Math.random() * (i + 1) );
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
}

//Essa é a função que armazena o id do quizz.
function getToLocalStorage(reponse){
    const receivedFromAPI = reponse.data.id;
    let todosOsSeusQuizzes= [];

    if(localStorage.getItem("idsQuizzUsuario") === null){
        todosOsSeusQuizzes.push(receivedFromAPI);

    }else{
        todosOsSeusQuizzes= localStorage.getItem("idsQuizzUsuario");
        todosOsSeusQuizzes= JSON.parse(todosOsSeusQuizzes);
        todosOsSeusQuizzes.push(receivedFromAPI);
    }

    localStorage.setItem(`idsQuizzUsuario`, [JSON.stringify(todosOsSeusQuizzes)]);

    quizzIsReady();
}
localStorage.clear()
//Esse é o link da API do BuzzQuizz
const API= "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

//Essa é a parte em que os quizzes do servidor são renderizados na tela Inicial. 
function buscarQuizzesServidor(){
    const promessa= axios.get(API);
    promessa.then(renderizarQuizzServidor);
}
buscarQuizzesServidor();

//Essa é a parte em que os quizzes do usuário são renderizados
function renderizarQuizzUsuario(seusQuizzes){
    const seusquizzUsuario= document.querySelector(".quizz-usuario .seus-quizzes");

    const semQuizzUsuario= document.querySelector(".sem-quizz-usuario");
    const quizzUsuario= document.querySelector(".quizz-usuario");

    semQuizzUsuario.classList.add('oculto');
    quizzUsuario.classList.remove('oculto');

    seusquizzUsuario.innerHTML+= `
                <figure id="${seusQuizzes.id}" onclick="irPraTelaDoQuizz(${seusQuizzes.id})">
                    <img src="${seusQuizzes.image}" alt="quizz">
                    <div class="gradiente"></div>
                    <figcaption>${seusQuizzes.title}</figcaption>
                </figure>
            `;
}

function renderizarQuizzServidor(res){
    const quizzServidor= document.querySelector(".quizz-servidor .todos-quizzes");
    console.log(res.data)

    //Aqui é pegado os ids dos quizzes do usuario e Deserializado.
    let quizzesDoUsuario= localStorage.getItem("idsQuizzUsuario");
    quizzesDoUsuario= JSON.parse(quizzesDoUsuario);
    console.log(quizzesDoUsuario)
    quizzServidor.innerHTML= ""

    
    for(let i=0; i<res.data.length; i++){

        if(quizzesDoUsuario !== null){
            for(let j=0; j<quizzesDoUsuario.length; j++){

                if(quizzesDoUsuario[j] === res.data[i].id){
                    renderizarQuizzUsuario(res.data[i]);
                    break;
                }
            }
        }

        quizzServidor.innerHTML+= `
            <figure id="${res.data[i].id}" onclick="irPraTelaDoQuizz(${res.data[i].id})" data-identifier="quizz-card">
                <img src="${res.data[i].image}" alt="quizz">
                <div class="gradiente"></div>
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
            <section class="pergunta-quizz identificador${i}" data-identifier="question">
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
            <figure onclick="escolherAlternativa(this)" data-identifier="answer">
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


//Essa é a parte em que o usuário vai para a tela de criação do quizz.
function irPraTelaDeCriaçãoDoQuizz(){
    const telaInicial= document.querySelector(".tela1-inicial");
    const telaCriaçãoQuizz= document.querySelector(".createAquizz");

    telaInicial.classList.add("oculto");
    telaCriaçãoQuizz.classList.remove("oculto");
}


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
            <div class="createQuestions" data-identifier="question-form">
                <ion-icon class = "ionicon" name="create-sharp" onclick = "expand(this)" data-identifier="expand"></ion-icon>
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

        createAquizz.innerHTML = createAquizz.innerHTML + `
        <h1>Crie suas perguntas</h1>
        <div class="createQuestions" data-identifier="question-form">
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
        let theCorrectImage = document.querySelector(`.correctImage${j}`).value;

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

        let theinorrectAnswer2 = document.querySelector(`.incorrectAnswer${j}-2`).value;
        let theinorrectImage2 = document.querySelector(`.wrongImage${j}-2`).value;

        if(theinorrectAnswer2 !== undefined && theinorrectAnswer2 !== ""  && theinorrectAnswer2 !== null){
            if (!isValidUrl(theinorrectImage2)){
                alert('Olá! Por favor preencha com a URL válida para a imagem!');
            }else{
                const theIncorrect2 = {
                    text: theinorrectAnswer2,
                    image: theinorrectImage2,
                    isCorrectAnswer: false
                };
                objQuestion.answers.push(theIncorrect2);
            }
        }else if(theinorrectAnswer2 === undefined || theinorrectAnswer2 === "" || theinorrectAnswer2 === null ){
            if(theinorrectImage2 === undefined || theinorrectImage2 === "" || theinorrectImage2 === null ){
                const theIncorrect2 = {
                    text: theinorrectAnswer2,
                    image: theinorrectImage2,
                    isCorrectAnswer: false
                };
                objQuestion.answers.push(theIncorrect2);
            }else{
                alert('Olá! Por favor preencha corretamente o campo de reposta!');  
            }
        } 
        

        let theinorrectAnswer3 = document.querySelector(`.incorrectAnswer${j}-3`).value;
        let theinorrectImage3 = document.querySelector(`.wrongImage${j}-3`).value;

        if(theinorrectAnswer3 !== undefined && theinorrectAnswer3 !== "" && theinorrectAnswer3 !== null){
            if (!isValidUrl(theinorrectImage3)){
                alert('Olá! Por favor preencha com a URL válida para a imagem!');
            }else{
                const theIncorrect3 = {
                    text: theinorrectAnswer3,
                    image: theinorrectImage3,
                    isCorrectAnswer: false
                };
                objQuestion.answers.push(theIncorrect3);
            }
        }else if(theinorrectAnswer3 === undefined || theinorrectAnswer3 === "" || theinorrectAnswer3 === null){
            if(theinorrectImage3 === undefined || theinorrectImage3 === "" || theinorrectImage3 === null){
                const theIncorrect3 = {
                    text: theinorrectAnswer3,
                    image: theinorrectImage3,
                    isCorrectAnswer: false
                };
                objQuestion.answers.push(theIncorrect3);
            }else{
                alert('Olá! Por favor preencha corretamente o campo de reposta!');  
            }
        } 
        objQuizz.questions.push(objQuestion);
    }

    console.log(objQuizz.questions);
    setTimeout(createLevels(),1500)
} 

function expand2(ioniconn){
    const reduced =  document.querySelector('.reduced');
    reduced.classList.remove('reduced');
    reduced.classList.add('expanded2');
}

function createLevels(){

    let hiddenLevels =  ``;

    resetinnerHTML()

    for(let l = 1; l < numLevels ; l++){
        hiddenLevels = hiddenLevels + `
            <div class="createLevels" data-identifier="level">
                <ion-icon class = "ionicon2" name="create-sharp" onclick = "expand2(this)" data-identifier="expand"></ion-icon>
                <h2>Nível ${l+1}</h2>
                <div class = 'reduced'>
                    <input type="text" class="levelTitle${l+1}" placeholder="Título do Nível">
                    <input type="text" class="percent${l+1}" placeholder="% de acerto mínima">
                    <input type="text" class="levelImage${l+1}" placeholder="URL da imagem do nível">
                    <input type="text" class="levelText${l+1}" placeholder="Descrição do nível">
                </div>
            </div>`
    }

    createAquizz.innerHTML = createAquizz.innerHTML + `
            <h1>Agora, decida os níveis</h1>
            <div class="createLevels" data-identifier="level">
                <h2>Nível 1</h2>
                <input type="text" class="levelTitle1" placeholder="Título do Nível">
                <input type="text" class="percent1" placeholder="% de acerto mínima">
                <input type="text" class="levelImage1" placeholder="URL da imagem do nível">
                <input type="text" class="levelText1" placeholder="Descrição do nível">
            </div>
            ${hiddenLevels}
            <button class="quizzFinalize" onclick = "getLevelValues()" >Finalizar Quizz</button>`


}

function checkzero (num){
    if (num === 0){
        return true
    }
}

function getLevelValues(){
 
    let percents = [];
    

    for( let k = 1 ; k <= numLevels ; k++){

        let objLevel = {
            title: undefined,
            image: undefined,
            text: undefined,
            minValue: undefined
        }

        let leveltitle = document.querySelector(`.levelTitle${k}`).value;

        if(leveltitle.length < 10){
            alert('Olá! O título de seu nível deve ter no mínimo 10 caracteres!');
        } else {
            objLevel.title = leveltitle;
        }

        let levelimage = document.querySelector(`.levelImage${k}`).value;

        if(!isValidUrl(levelimage)){
            alert('Olá! Por favor preencha com a URL válida para a imagem!');
        }else{
            objLevel.image = levelimage;
        }

        let leveltext = document.querySelector(`.levelText${k}`).value;

        if(leveltext.length < 30 ){
            alert('Olá! A descrição de seu nível deve ter no mínimo 10 caracteres!');
        }else{
            objLevel.text = leveltext;
        }

        let percent = Number(document.querySelector(`.percent${k}`).value);

        if(percent === null || percent === undefined || percent === '' || percent < 0 || percent > 100) {
            alert('Olá! Por favor preencha com um número válido de 0 a 100 para a porcentagem de acerto de seu quizz!');
        }else{
            objLevel.minValue = percent;
            percents.push(percent);
        }

        let filtrado = percents.filter(checkzero);
         if( filtrado.length < 1){
            alert('Olá! Em ao menos um dos níveis a porcentagem de acerto mínima de seu quizz deve ser 0!');
        }else{
            objQuizz.levels.push(objLevel);      
        }
    
}

const promisse = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', objQuizz);
promisse.then(getToLocalStorage);

}

function quizzIsReady() {

    resetinnerHTML()

    createAquizz.innerHTML = createAquizz.innerHTML + `
        <h1>Seu quizz está pronto!</h1>
            <div class="quizzReady">
                    <div class="gradient"></div>
                    <img src="${objQuizz.image}">
                    <h2>${objQuizz.title}</h2>
            </div>
            <button class="accessQuizz">Acessar Quizz</button>
            <h3 onclick = "voltarPraTelaInicial()">Voltar pra home</h3> `;

}


/* ======= */

