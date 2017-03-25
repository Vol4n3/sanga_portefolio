var contexteAudio = new (window.AudioContext || window.webkitAudioContext)(); // définition du contexte audio
// les navigateurs avec un moteur Webkit/blink demandent un préfixe

var voixSelectionnee = document.getElementById("voice"); // case à cocher pour la sélection d'effets de voix
var visualisationSelectionnee = document.getElementById("visual"); // case à cocher pour la sélection d'options de visualisation audio
var silence = document.querySelector('.mute'); // bouton pour couper le son
var renduVisuel; // requestAnimationFrame

var analyseur = contexteAudio.createAnalyser();
var distorsion = contexteAudio.createWaveShaper();
var gainVolume = contexteAudio.createGain();
var filtreAccordable = contexteAudio.createBiquadFilter();

function creerCourbeDistorsion(taille) { // fonction qui crée une forme de courbe qui sera utilisée par le générateur de l'onde de distorsion
  var k = typeof taille === 'number' ? taille : 50,
    nombre_echantillons = 44100,
    courbe = new Float32Array(nombre_echantillons),
    angle = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < nombre_echantillons; ++i ) {
    x = i * 2 / nombre_echantillons - 1;
    courbe[i] = ( 3 + k ) * x * 20 * angle / ( Math.PI + k * Math.abs(x) );
  }
  return courbe;
};

navigator.getUserMedia (
  // contraintes - uniquement audio dans cet exemple
  {
    audio: true
  },

  // callback de succès
  function(flux) {
    source = contexteAudio.createMediaStreamSource(flux);
    source.connect(analyseur);
    analyseur.connect(distorsion);
    distorsion.connect(filtreAccordable);
    filtreAccordable.connect(gainVolume);
    gainVolume.connect(contexteAudio.destination); // connecte les différents noeuds de graphes audio entre eux

    genererVisualisation(flux);
    voiceChange();

  },

  // callback d'erreur
  function(err) {
    console.log("L'erreur GUM suivante a eu lieu : " + err);
  }
);

function genererVisualisation(flux) {
  const LARGEUR = canvas.width;
  const HAUTEUR = canvas.height;

  var parametreVisualisation = visualisationSelectionnee.value;
  console.log(parametreVisualisation);

  if(parametreVisualisation == "sinewave") {
    analyseur.fftSize = 2048;
    var tailleBuffer = analyseur.frequencyBinCount; // la moitié de la valeur FFT (Transformation de Fourier rapide)
    var tableauDonnees = new Uint8Array(tailleBuffer); // crée un tableau pour stocker les données

    canvasCtx.clearRect(0, 0, LARGEUR, HAUTEUR);

    function draw() {

      renduVisuel = requestAnimationFrame(draw);

      analyseur.getByteTimeDomainData(tableauDonnees); // récupère les données de l'onde de forme et les met dans le tableau créé

      canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // dessine une onde dans le canvas
      canvasCtx.fillRect(0, 0, LARGEUR, HAUTEUR);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = LARGEUR * 1.0 / tailleBuffer;
      var x = 0;

      for(var i = 0; i < tailleBuffer; i++) {

        var v = tableauDonnees[i] / 128.0;
        var y = v * HAUTEUR/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();

  } else if(parametreVisualisation == "off") {
    canvasCtx.clearRect(0, 0, LARGEUR, HAUTEUR);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, LARGEUR, HAUTEUR);
  }

}

function modifierVoix() {
  distorsion.curve = new Float32Array;
  filtreAccordable.gain.value = 0; // reset les effets à chaque fois que la fonction modifierVoix est appelée

  var choixVoix = voixSelectionnee.value;
  console.log(choixVoix);

  if(choixVoix == "distortion") {
    distorsion.curve = creerCourbeDistorsion(400); // applique la distorsion au son en utilisant le noeud d'onde de forme
  } else if(choixVoix == "biquad") {
    filtreAccordable.type = "lowshelf";
    filtreAccordable.frequency.value = 1000;
    filtreAccordable.gain.value = 25; // applique le filtre lowshelf aux sons qui utilisent le filtre accordable
  } else if(choixVoix == "off") {
    console.log("Choix de la voix désactivé"); // ne fait rien, quand l'option off est sélectionnée
  }

}

// écouteurs d'évènements pour les changements de visualisation et de voix

visualisationSelectionnee.onchange = function() {
  window.cancelAnimationFrame(renduVisuel);
  genererVisualisation(flux);
}

voixSelectionnee.onchange = function() {
  modifierVoix();
}

silence.onclick = muterVoix;

function muterVoix() { // allumer / éteindre le son
  if(silence.id == "") {
    gainVolume.gain.value = 0; // gain à 0 pour éteindre le son
    silence.id = "activated";
    silence.innerHTML = "Unmute";
  } else {
    gainVolume.gain.value = 1; // gain à 1 pour allumer le son
    silence.id = "";    
    silence.innerHTML = "Mute";
  }
}