

window.addEventListener('load', function () {
    document.getElementById('galery').addEventListener('click',function(e){
        $(this).toggleClass('invisible');
        $('#main_header').toggleClass('blur');
    })
    //const jc_physics = require("./jc_physics.js");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var analyseur = context.createAnalyser();
    var mainHeader = document.getElementById('main_header');

    analyseur.fftSize = Math.pow(2, 8);

    //analyseur.fftSize = 1024;
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
     * @type {HTMLCanvasElement} canvas
     */
    var canvas = document.getElementById('particle');

    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    window.addEventListener('resize', function () {
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
    })
    var ctx = canvas.getContext('2d');


    var w = new jc_physics.World();
    for (let i = 0; i < 50; i++) {
        let p = new jc_physics.SnowFlake(Math.random() * canvas.width, Math.random() * canvas.height, Math.random());
        w.add(p);
    }
    var tailleBuffer = analyseur.frequencyBinCount;
    var tableauDonnees = new Uint8Array(tailleBuffer);
    w.speed = 0.50;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var freq = 600;
    var sfreq = 0;
    w.wind.y = -0.02;
    w.speed = 0.10;
    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Uint8Array} tableauDonnees 
     * @param {Boolean} inverse 
     */
    var drawLine = function (ctx,tableauDonnees,inverse) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255, 255,255)';
        if(inverse)ctx.fillStyle = 'rgba(255,255,255,0.3)';
        else  ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        posX = ctx.canvas.width - 100;
        posY = ctx.canvas.height - 100;
        var x = (50 + tableauDonnees[0] / 6) * Math.cos(0);
        var y = (50 + tableauDonnees[0] / 6) * Math.sin(0);
        ctx.moveTo(posX + x, posY + y);
        if( inverse){
            for (var i = -1; i >= -180; i--) {
                var angle = Math.PI * i / 180;
                var donnee = Math.round(-1 * i * (analyseur.fftSize / 2.2) / 180);
                x = (50 + tableauDonnees[donnee] / 6) * Math.cos(angle);
                y = (50 + tableauDonnees[donnee] / 6) * Math.sin(angle);
                ctx.lineTo(posX + x, posY + y);
            }
        }else{
            for (var i = 1; i <= 180; i++) {
                var angle = Math.PI * i / 180;
                var donnee = Math.round(1 * i * (analyseur.fftSize / 2.2) / 180);
                x = (50 + tableauDonnees[donnee] / 6) * Math.cos(angle);
                y = (50 + tableauDonnees[donnee] / 6) * Math.sin(angle);
                ctx.lineTo(posX + x, posY + y);
            }
        }
        ctx.stroke();
        ctx.fill();
    }
    function boucle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyseur.getByteFrequencyData(tableauDonnees);
        drawLine(ctx,tableauDonnees);
        drawLine(ctx,tableauDonnees,true);
        w.draw(ctx);
        requestAnimationFrame(boucle)
    }
    requestAnimationFrame(boucle)

})