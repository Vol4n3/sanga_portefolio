
(function(){
    let isMoved;
    document.getElementById('main_header').style.backgroundPositionY = window.pageYOffset/10 *-1 + 'px';
    window.addEventListener('scroll',function(e){
        let ht = document.getElementById('header_title')
        if(window.pageYOffset > 150 && !isMoved){
            ht.style.left = "350px";
            ht.style.opacity = "0";
            isMoved = true;
        }
        if(window.pageYOffset < 150 && isMoved){
            ht.style.left = "0px";
            ht.style.opacity = "1";
            isMoved = false;
        }
        document.getElementById('main_header').style.backgroundPositionY = window.pageYOffset/100*-1 + 'px';
    });
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var audioBuffer = null;
    function load(){
        var req = new XMLHttpRequest();
        req.open('get','assets/extrait.mp3');
        req.responseType = 'arraybuffer';
        req.addEventListener('load',function(ev){
            context.decodeAudioData(req.response,function(buffer){
                audioBuffer = buffer;
                var source = context.createBufferSource();
                source.buffer = buffer;                   
                source.connect(context.destination);     
                source.start(0);   
            })
        });
        req.send();
    }
    load();
})()