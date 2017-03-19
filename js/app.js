
(function () {
    let isMoved;
    document.getElementById('main_header').style.backgroundPositionY = window.pageYOffset / 10 * -1 + 'px';
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
        document.getElementById('main_header').style.backgroundPositionY = window.pageYOffset / 100 * -1 + 'px';
    });
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var audioBuffer = null;
    function load() {
        var req = new XMLHttpRequest();
        req.open('get', 'assets/extrait.mp3');
        req.responseType = 'arraybuffer';
        req.addEventListener('load', function (ev) {
            context.decodeAudioData(req.response, function (buffer) {
                audioBuffer = buffer;
                var source = context.createBufferSource();
                var gainNode = context.createGain();
                source.buffer = buffer;
                source.connect(gainNode);
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    window.addEventListener('resize',function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })
    var ctx = canvas.getContext('2d');
    

    var w = new jc_physics.World();
    for (let i = 0; i < 100; i++) {
        let p = new jc_physics.SnowFlake(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() );
        w.add(p);
    }
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    function boucle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        w.draw(ctx);
        requestAnimationFrame(boucle)
    }
    requestAnimationFrame(boucle)

})()