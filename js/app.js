
(function () {

    //const jc_physics = require("./jc_physics.js");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var analyseur = context.createAnalyser();
    analyseur.fftSize = 32768;
    var audioBuffer = null;
    function load() {
        var req = new XMLHttpRequest();
        req.open('get', 'assets/extrait.mp3');
        //req.open('get', 'mp3/mus01.mp3');
        req.responseType = 'arraybuffer';
        req.addEventListener('load', function (ev) {
            context.decodeAudioData(req.response, function (buffer) {
                audioBuffer = buffer;
                var source = context.createBufferSource();
                var gainNode = context.createGain();
                source.buffer = buffer;
                source.connect(analyseur);
                analyseur.connect(gainNode);
                gainNode.connect(context.destination);
                gainNode.gain.value = 0.2;
                source.start(0);

            })
        });
        req.send();
    }
    load();

    // particles
    /**
     * @type {HTMLCanvasElement}
     */
     var mainHeader = document.getElementById('main_header');
    var canvas = document.getElementById('particle');
    canvas.width = mainHeader.offsetWidth;
    canvas.height = mainHeader.offsetHeight;
    window.addEventListener('resize', function () {
        canvas.width = mainHeader.offsetWidth;
        canvas.height = mainHeader.offsetHeight;
    })
    var ctx = canvas.getContext('2d');


    var w = new jc_physics.World();
    for (let i = 0; i < 150; i++) {
        let p = new jc_physics.SnowFlake(Math.random() * canvas.width, Math.random() * canvas.height, Math.random());
        w.add(p);
    }
    var tailleBuffer = analyseur.frequencyBinCount;
    var tableauDonnees = new Uint8Array(tailleBuffer);
    w.speed = 0.50;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
            var freq = 135;
            var sfreq = 35;
    function boucle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        w.draw(ctx);
       
        analyseur.getByteFrequencyData(tableauDonnees);
        ctx.beginPath();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(255, 255,255)';
        ctx.lineWidth = 2;
        var sliceWidth = canvas.width * 1.0 / tailleBuffer;
        var largeurBarre = (canvas.width / (tailleBuffer/5)) * 2.5;
        var hauteurBarre;
        var x = sfreq;
        var basseCount = 0;

        for(var i = sfreq; i<freq; i++ ){
            basseCount += tableauDonnees[0];
        }
        var moyenn = basseCount / (freq - sfreq);
        var boost =(moyenn  /20 +0.50 );
        if(moyenn >45){

            w.speed = boost +0.50;
        }else{
                w.speed = 0.50;
        }
      for (var i = sfreq; i < freq  ; i++) {
          hauteurBarre = tableauDonnees[i];
          ctx.fillStyle = 'rgb(' + hauteurBarre + ',' + hauteurBarre + ',' + hauteurBarre + ')';
          ctx.fillRect(x, canvas.height - hauteurBarre, largeurBarre, hauteurBarre);
          x += largeurBarre + 1;
      }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        requestAnimationFrame(boucle)
    }
    requestAnimationFrame(boucle)

})()