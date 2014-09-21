//Poem Shuffler
function launch(){
    window.scrollTo(0, 0);
    
    //umbrella document elements
    var wrapLeft = document.getElementById('wrapLeft');
    var readout = document.getElementById('readout');

    //word vessels
    var deck = [];
    var shuffledDeck = [];
    var shuffledPoem = [];
    var title = [];
    
    //numerical manipulators
    var num = [];
    var r;
    
    //timers
    var shuffleTime;
    
    //set max words/phrases to deal
    var howMany = wrapLeft.querySelector('input[type="text"]');
    var dealCap;
    function setCap(){
        if(!howMany.value || isNaN(howMany.value)){
            dealCap = 30;
        }else{
            dealCap = howMany.value;
        }
    }
    
    //create array of random, unique indexes
    function indexArray(total, matchArray){
        num = [];
        var stop = Math.min(total, matchArray.length);
        while(num.length < stop){
            r = Math.round(Math.random() * (matchArray.length - 1));
            if(num.indexOf(r) === -1){
                num.push(r);
            }
        }
    }
    
    //split poems into words
    function splitter(string){
        var words = string.split(' ');
        var phrases = [];
        var phrase = '';
        for(var w = 0; w < words.length; w += r){
            r = 1 + Math.round(Math.random() * 3);
            for(var p = 0; p < r; p++){
                if(w + p < words.length){
                    phrase = phrase.concat(words[w + p], ' ');
                }
            }
            phrases.push(phrase);
            phrase = '';
        }
        deck.push(phrases);
    }
    
    //handle user text
    var yourWords = false;
    function splitYours(){
        var yours = wrapLeft.querySelector('textarea');
        if(yours.value){
            yourWords = true;
            title.push(' your words');
            var yourSplit = yours.value.split('^');
            if(yourSplit.length > 1){
                deck.push(yourSplit);
            }else{
                splitter(yours.value);
            }
            dealCap -= deck[0].length;
        }
    }
    
    //handle selected poems
    var selection = document.getElementById('selection');
    function splitSelected(){
        var checkboxes = selection.querySelectorAll('input[type="checkbox"]');
        var checks = [];
        for(var c = 0; c < checkboxes.length; c++){
            if(checkboxes[c].checked){
                checks.push(c);
            }
        }
        if(checks.length > 0){
            for(var p = 0; p < checks.length; p++){
                splitter(poems[checks[p]][1]);
                title.push(poems[checks[p]][0]);
            }
        }
    }

    //handle random poems
    var maxPoems;
    function splitRandom(){
        maxPoems = Math.max(Math.min(poems.length, dealCap), 1);
        indexArray(maxPoems, poems);
        for(var n = 0; n < num.length; n++){
            splitter(poems[num[n]][1]);
            title.push(poems[num[n]][0]);
        }
    }

    //get random words balanced between poems
    function shuffle(){
        var start = 0;
        if(yourWords){
            start = 1;
            for(var w = 0; w < deck[0].length; w++){
                shuffledDeck.push(deck[0][w]);
            }
        }
        var perPoem = Math.max(Math.min(dealCap/(deck.length - start), (deck.length - start)), 1);
        for(var p = start; p < deck.length; p++){
            indexArray(perPoem, deck[p]);
            for(var n = 0; n < num.length; n++){
                shuffledDeck.push(deck[p][num[n]]);
            }
        }
    }
    
    //deal words from all included poems in random order
    function deal(){
        if(shuffledDeck.length > 0){
            r = Math.round(Math.random() * (shuffledDeck.length - 1));
            readout.insertAdjacentHTML('beforeend', shuffledDeck[r] + '<br>');
            shuffledPoem.push(shuffledDeck.splice(r, 1) + '\n');
        }else{
            oneMoreThing();
        }
    }
    
    //after finished dealing
    function oneMoreThing(){
        clearInterval(shuffleTime);
        var cigar = document.getElementById('cigar');
        cigar.setAttribute('style', 'display:block');
        var today = new Date();
        cigar.insertAdjacentHTML('afterbegin', '<p>Poem Shuffler dealt words from: '+title+'.</p><p>'+today.toDateString()+'</p>');
        document.location = '#cigar';
        shuffledPoem.push('\nPoem Shuffler dealt words from: '+title+'\n'+today.toDateString());
    }
    
    //save shuffled poem
    var poemBlob;
    var link;
    function saveFile(){
        link = document.createElement('a');
        link.innerHTML = 'Download shuffled poem';
        link.download = 'shuffledPoem.txt';
        poemBlob = new Blob(shuffledPoem, {type:'text/plain'});
        link.href = window.URL.createObjectURL(poemBlob);
        document.getElementById('downloader').appendChild(link);
    }
    
    //buttons
    var buttons = wrapLeft.querySelectorAll('input[type="button"]');
    var choose = document.getElementById('choose');
    
    //choose random poems
    buttons[0].addEventListener('click', function(){
        maxPoems = 1;
        choose.setAttribute('style', 'display:block');
        buttons[0].setAttribute('style', 'display:none');
        buttons[1].setAttribute('style', 'display:none');
        window.scrollTo(0, howMany.offsetTop);
    }); 
    
    //choose selected poems 
    buttons[1].addEventListener('click', function(){
        selection.setAttribute('style', 'display:block');
        choose.setAttribute('style', 'display:block');
        buttons[0].setAttribute('style', 'display:none');
        buttons[1].setAttribute('style', 'display:none');
        if(buttons[2].getAttribute('style') === 'display:none'){
            window.scrollTo(0, selection.offsetTop);
        }else{
            window.scrollTo(0, howMany.offsetTop);
        }
    });
    
    //add your words
    buttons[2].addEventListener('click', function(){
        document.getElementById('addText').setAttribute('style', 'display:block');
        choose.setAttribute('style', 'display:block');
        buttons[2].setAttribute('style', 'display:none');
        window.scrollTo(0, howMany.offsetTop);
    });
    
    //submit, shuffle, and deal
    buttons[3].addEventListener('click', function(){
        document.getElementById('choices').setAttribute('style', 'display:none');
        setCap();
        splitYours();
        splitSelected();
        if(maxPoems === 1){
            splitRandom();
        }
        shuffle();
        window.scrollTo(0, 0);
        shuffleTime = setInterval(deal, 1500);
    });
    
    //save shuffled poem
    buttons[4].addEventListener('click', function(){
        saveFile();
    });
    
    //shuffle again
    buttons[5].addEventListener('click', function(){
        if(link){
            window.URL.revokeObjectURL(link);
        }
        window.location.assign('index.html');
    });
    
    //footer
    var feet = wrapLeft.querySelectorAll('h2');
    var toes = wrapLeft.querySelectorAll('#footer>p');
    //show/hide problem/suggestion
    feet[0].addEventListener('click', function(){
        for(var t = 0; t < 2; t++){
            if(toes[t].getAttribute('style') === 'display:none'
              || !toes[t].getAttribute('style')){
                toes[t].setAttribute('style', 'display:block');
                window.scrollTo(0, feet[0].offsetTop);
            }else{
                toes[t].setAttribute('style', 'display:none');
            }
        }
    });
    //show/hide copyright
    feet[1].addEventListener('click', function(){
        for(var t = 2; t < toes.length; t++){
            if(toes[t].getAttribute('style') === 'display:none'
              || !toes[t].getAttribute('style')){
                toes[t].setAttribute('style', 'display:block');
                window.scrollTo(0, feet[1].offsetTop);
            }else{
                toes[t].setAttribute('style', 'display:none');
            }
        }
    });
}
window.onload = launch;