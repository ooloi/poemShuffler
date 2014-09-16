//Poem Shuffler
function launch(){

//document elements
var choices = document.getElementById('choices');
var yourText = document.getElementById('yourText');
var addText = document.getElementById('addText');
var textInput = document.getElementById('textInput');
var randomShuffle = document.getElementById('random');
var select = document.getElementById('select');
var selection = document.getElementById('selection');
var finish = document.getElementById('finish');
var deal = document.getElementById('deal');
var submit = document.getElementById('submit');
var output = document.getElementById('output');
var final = document.getElementById('final');
var repeat = document.getElementById('repeat');
var saveBlob = document.getElementById('save');
var dSpot = document.getElementById('downloader');

//other global variables
var r;
var words = [];
var temp;
var randomize = false;
var poemShuffle = [];
var shuffledPoems = [];
var shuffleTime;
var fadeTime;

//colors
var textPalette = ['rgba(210, 185, 255, 1)', 'rgba(255, 216, 198, 1)', 'rgba(255, 248, 191, 1)', 'rgba(180, 255, 191, 1)', 'rgba(180, 214, 255, 1)', 'rgba(255, 209, 253, 1)'];

//set up canvas
var canvas = document.getElementById('drawing');
if(canvas.getContext){
    var ctx = canvas.getContext('2d');
}
ctx.fillStyle = 'rgba(11, 42, 47, 1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

//display hidden sections
function unHide(object){
    object.removeAttribute('class', 'hide');
}
    
//split string and add to words
function splitter(string){
    temp = string.split(' ');
    for(i=0; i<temp.length; i+=r){
        this.phrase = '';
        r = 1 + Math.round(Math.random() * 3);
        for(j=0; j<r; j++){
            if(i+j<temp.length){
                phrase = phrase.concat(temp[i+j], ' ');
            }else{
                phrase = temp[i];
            }
        }
        words = words.concat(phrase);
    }
}

//handle user text
function addYours(){
    temp = textInput.value.split('^');
    if(temp.length>1){
        words = words.concat(temp);
    }else{
        splitter(textInput.value);
    }
}

//set number of words to return
function dealer(){
    if(isNaN(deal.value) || deal.value==''){
        deal = words.length;
    }else{
        deal = deal.value;
    }
}
    
//display random word/phrase, remove from words, add to poemShuffle
function shuffle(){
    if(deal>0){
        r = Math.round(Math.random() * (words.length - 1));
        output.insertAdjacentHTML('beforeend', words[r]+'<br>');
        this.f = 20 + Math.round(Math.random() * 50);
        ctx.font = f + 'px serif';
        this.x = f/2 + Math.round(Math.random() * (canvas.width - f/2 * words[r].length));
        this.y  = f + Math.round(Math.random() * (canvas.height - 2*f));
        this.tC = Math.round(Math.random() * (textPalette.length - 1));
        ctx.fillStyle = textPalette[tC];
        ctx.fillText(words[r], x, y);
        poemShuffle = poemShuffle.concat(words.splice(r, 1)+'\n');
        deal--;
    }else{
        oneMoreThing();
    }
}

function fade(){
    if(deal>0){
        ctx.fillStyle = 'rgba(11, 42, 47, 0.01)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}
    
function oneMoreThing(){
    clearInterval(shuffleTime);
    clearInterval(fadeTime);
    this.today = new Date();
    final.insertAdjacentHTML('beforeend', '<p>Poem Shuffler dealt this round\'s words from: '+shuffledPoems+'.</p><p>'+today.toDateString()+'</p>');
    unHide(final);
    document.location = '#final';
    poemShuffle = poemShuffle.concat('\nPoem Shuffler dealt this round\'s words from: '+shuffledPoems+'\n'+today.toDateString());
}

function saveFile(){
    var poemBlob;
    var link = document.createElement('a');
    link.innerHTML = 'Download shuffled poem';
    link.download = 'poemShuffler.txt';
    poemBlob = new Blob(poemShuffle, {type:'text/plain'});
    link.href = window.URL.createObjectURL(poemBlob);
    dSpot.appendChild(link);
}

//select initial choice
yourText.addEventListener('click', function(e){
    unHide(addText);
    unHide(finish);
});
select.addEventListener('click', function(e){
    unHide(selection);
    unHide(finish);
});
randomShuffle.addEventListener('click', function(e){
    randomize = true;
    unHide(finish);
});

//activate shuffle
submit.addEventListener('click', function(e){
    if(randomize){
        for(p=0; p<poems.length; p++){
            splitter(poems[p][1]);
            shuffledPoems = shuffledPoems.concat(poems[p][0]);
        }
    }
    if(document.getElementById('dickinson').checked){
        splitter(dickinson[1]);
        shuffledPoems = shuffledPoems.concat(dickinson[0]);
    }
    if(document.getElementById('eliot').checked){
        splitter(eliot[1]);
        shuffledPoems = shuffledPoems.concat(eliot[0]);
    }
    if(document.getElementById('frost').checked){
        splitter(frost[1]);
        shuffledPoems = shuffledPoems.concat(frost[0]);
    }
    if(document.getElementById('millay').checked){
        splitter(millay[1]);
        shuffledPoems = shuffledPoems.concat(millay[0]);
    }
    if(document.getElementById('shelley').checked){
        splitter(shelley[1]);
        shuffledPoems = shuffledPoems.concat(shelley[0]);
    }
    if(document.getElementById('wordsworth').checked){
        splitter(wordsworth[1]);
        shuffledPoems = shuffledPoems.concat(wordsworth[0]);
    }
    if(textInput.value){
        addYours();
        shuffledPoems = shuffledPoems.concat(' your words');
    }
    
    choices.setAttribute('class', 'hide');
    dealer();
    shuffleTime = setInterval(shuffle, 1500);
    fadeTime = setInterval(fade, 120);
});

saveBlob.addEventListener('click', function(e){
    saveFile();
    window.URL.revokeObjectURL(link);
});

repeat.addEventListener('click', function(e){
    document.location.reload(true);
});
}
window.onload = launch;