//Começo código Júlia
{
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
}