const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const gainNode = context.createGain();
gainNode.connect(context.destination);

const buffers = {};

const load = (source, key) => {
  const request = new XMLHttpRequest();
  request.open('GET', source, true);
  request.responseType = 'arraybuffer';
  request.onload = () => {
    context.decodeAudioData(
      request.response,
      response => {
        buffers[key] = response;
      }
    );
  };
  request.send();
};

const init = () => (
  new Promise(async resolve => {
    await load('./public/sound/start.mp3', 'start');
    await load('./public/sound/stop.mp3', 'stop');

    resolve();
  })
);

const play = name => {
  const sound = context.createBufferSource();
  sound.buffer = buffers[name];
  sound.connect(gainNode);
  sound.start(0);
};

export default {
  init,
  play,
};
