import fetch from 'unfetch';
import hud from './hud';
import face from './face';
import response from './response';
import sound from './sound';

let recognition;
let finalTranscript;
let idleMessage;

const listen = () => {
  // Reset idle timeout
  clearTimeout(idleMessage);

  // Reset interface
  hud.cardContainer.innerHTML = '';
  hud.responseText.innerHTML = '';
  hud.requestInterim.innerHTML = '';
  hud.requestFinal.innerHTML = '';

  // Show listening interface
  hud.speakNow.classList.remove('hidden');
  document.body.classList.add('dimmed');

  sound.play('start');
  face.change('notice');

  finalTranscript = '';
  recognition = new webkitSpeechRecognition(); // eslint-disable-line
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = event => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    hud.requestFinal.innerHTML = finalTranscript;
    hud.requestInterim.innerHTML = interimTranscript;
  };
  recognition.start();
};

const process = () => {
  hud.requestFinal.innerHTML = '';
  hud.requestInterim.innerHTML = '';

  // Hide listening interface
  hud.speakNow.classList.add('hidden');
  document.body.classList.remove('dimmed');

  recognition.stop();
  recognition.onend = async () => {
    hud.requestFinal.innerHTML = '';
    hud.requestInterim.innerHTML = '';

    if (!finalTranscript) {
      face.change('idle');
      sound.play('stop');
      return;
    }

    const intents = await fetch(`/intent?input=${finalTranscript}`);
    const data = await intents.json();

    response.parse(data);
  };
};

const fromString = async input => {
  hud.cardContainer.innerHTML = '';
  const intents = await fetch(`/intent?input=${input}`);
  const data = await intents.json();

  response.parse(data);
};

export default {
  listen,
  process,
  fromString,
};
