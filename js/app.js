
(function () {
    /**
     * @param {jc_physics}
     */
    const jc_physics = window.jc_physics;
    let isMoved;
    var mainHeader = document.getElementById("main_header");
    mainHeader.style.backgroundPositionY = window.pageYOffset / 10 * -1 + 'px';
    window.addEventListener('scroll', function (e) {
        let ht = document.getElementById('header_title')
        if (window.pageYOffset > 150 && !isMoved) {
            ht.style.left = "350px";
            ht.style.opacity = "0";
            isMoved = true;
        }
        if (window.pageYOffset < 150 && isMoved) {
            ht.style.left = "0px";
            ht.style.opacity = "1";
            isMoved = false;
        }
        mainHeader.style.backgroundPositionY = window.pageYOffset / 100 * -1 + 'px';
    });
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var analyseur = context.createAnalyser();
    analyseur.fftSize = 4096;
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
    var logg = setInterval(function () {
        //analyseur.getByteTimeDomainData(tableauDonnees);
        //console.log(tableauDonnees);

    }, 100)
    setTimeout(function () {

        clearInterval(logg)
    }, 2000)
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    function boucle() {

        w.wind.add(new jc_physics.Vector(0, 0))


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        w.draw(ctx);
        ///tes
        analyseur.getByteFrequencyData(tableauDonnees);
        ctx.beginPath();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(255, 255,255)';
        ctx.lineWidth = 2;


        var sliceWidth = canvas.width * 1.0 / tailleBuffer;
        var largeurBarre = (canvas.width / tailleBuffer) * 2.5;
      var hauteurBarre;
        var x = 0;
        for (var i = 0; i < tailleBuffer; i++) {
/*
            var v = tableauDonnees[i] / 128.0;
            var y = v * canvas.height / 2;

             if (i === 0) {
                 ctx.moveTo(x, y);
             } else {
                 ctx.lineTo(x, y);
             }
*/
        hauteurBarre = tableauDonnees[i];
        
        ctx.fillStyle = 'rgb(' + hauteurBarre + ','+hauteurBarre+','+hauteurBarre+')';
        ctx.fillRect(x,canvas.height - hauteurBarre ,largeurBarre,hauteurBarre);

        x += largeurBarre + 1;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();



        requestAnimationFrame(boucle)
    }
    requestAnimationFrame(boucle)

})()