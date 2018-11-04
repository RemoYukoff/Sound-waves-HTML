window.onload = function() {
  //Lector de frecuencias
  ctx = new AudioContext();
  audio = document.getElementById("audio");
  audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();

  //Conexiones
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  //Creamos las barras
  var gamma = 8; //Aumentar para barras más grandes
  var bars = document.getElementById("bars");
  var width = screen.width / gamma;
  var offset = 0;
  for (i = 0; i < width; i++) {
    var bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", offset);
    bar.setAttribute("y", 0);
    bar.setAttribute("width", gamma);
    bar.setAttribute("height", 0);
    offset += gamma;
    bars.appendChild(bar);
    if (i == analyser.frequencyBinCount) {
      break;
    }
  }

  waves()
}


function setAudio(input) {
  var reader = new FileReader();
  var file = input.files[0];

  reader.onloadend = function() {
    audio.src = reader.result;
  }

  reader.readAsDataURL(file);
}


function waves() {
  //Actualizar frecuencias
  analyser.getByteFrequencyData(frequencyData);

  //Asignar nuevos valores a las barras
  bars = document.getElementById('bars').getElementsByTagName('rect');
  for (i = 0; i < bars.length; i++) {
    bars[i].setAttribute("height", frequencyData[i] * 2);
  }

  //Cambio de fondo
  var container = document.getElementById("bottom-container");
  container.style.background = "linear-gradient(to top, #000000 , " + rgbToHex(frequencyData[70] / 2, 0, frequencyData[70] / 2) + ")";
  setTimeout(waves, 30);
}


function rgbToHex(r, g, b) {

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
