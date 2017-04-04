var analyseur;
window.addEventListener('load', function () {
    "use strict";
    document.body.addEventListener('click', function (e) {
        var elem = e.target;
        if (elem == document.getElementById('btn_galery') || elem == document.getElementById('galery')) {
            var $galery = $('#galery')
            
            if ($galery.hasClass('hide')) {
                $galery.toggleClass('hide');
                setTimeout(function(){
                    $galery.toggleClass('invisible');
                },1)
            } else {
                $galery.toggleClass('invisible');
                setTimeout(function () {
                    $galery.toggleClass('hide');
                }, 1000)
            }
            $('#main_header').toggleClass('blur');
        }
        if ($(elem).hasClass('img')) {
            console.log('tru')
        }
    });
    //const jc_physics = require("./jc_physics.js");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    analyseur = context.createAnalyser();
    var mainHeader = document.getElementById('main_header');
    analyseur.fftSize = Math.pow(2, 11);
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
    var tableauDonnees = new Uint8Array(128);
    w.speed = 0.50;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    w.wind.y = -0.02;
    w.speed = 0.10;
    const CIRCLE_SIZE_MIN = 25;
    const CIRCLE_SIZE_FACTOR = 0.20;
    const TWO_PI = Math.PI * 2;
    analyseur.minDecibels = -64;
    analyseur.maxDecibels = -2;
    analyseur.smoothingTimeConstant = 0.45;
    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Uint8Array} tableauDonnees 
     * @param {Boolean} inverse 
     */
    var drawLine = function (ctx, tableauDonnees) {
        var smoothTabs = Smooth(tableauDonnees, {
            period: TWO_PI,
            method: Smooth.METHOD_CUBIC,
            sincFilterSize: 10,
            scaleTo: 10,
            clip: Smooth.CLIP_PERIODIC, 
        });
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255, 255,255)';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        var posX = ctx.canvas.width - 100;
        var posY = ctx.canvas.height - 100;
        var iteration = Math.round(1 * tableauDonnees.length / TWO_PI);
        var change = TWO_PI / tableauDonnees.length;
        var x = (CIRCLE_SIZE_MIN + smoothTabs(0) * CIRCLE_SIZE_FACTOR) * Math.cos(0);
        var y = (CIRCLE_SIZE_MIN + smoothTabs(0) * CIRCLE_SIZE_FACTOR) * Math.sin(0);
        ctx.moveTo(posX + x, posY + y);
        for (var i = change; i <= Math.PI * 2; i += change) {

            x = (CIRCLE_SIZE_MIN + smoothTabs(i) * CIRCLE_SIZE_FACTOR) * Math.cos(i);
            y = (CIRCLE_SIZE_MIN + smoothTabs(i) * CIRCLE_SIZE_FACTOR) * Math.sin(i);

            ctx.lineTo(posX + x, posY + y);
        }
        ctx.stroke();
        ctx.fill();
    }
    function boucle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyseur.getByteFrequencyData(tableauDonnees);
        drawLine(ctx, tableauDonnees);
        w.draw(ctx);
        requestAnimationFrame(boucle)
    }
    requestAnimationFrame(boucle)

})