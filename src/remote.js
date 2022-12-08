import h from 'hyperscript';

let io;
let debuff = false;

const speechToggleButton = h('div.speech-toggle-button', {
  ontouchstart: () => {
    io.emit('speechstart');
    speechToggleLabel.innerHTML = 'Release to stop speaking';
  },
  ontouchend: () => {
    io.emit('speechstop');
    speechToggleLabel.innerHTML = 'Press and hold to speak';
  },
});

const speechToggleLabel = h('div.speech-toggle-label', 'Press and hold to speak');
const instructionLabel = h('div.instruction-label', {
  onclick: () => {
    if (!debuff) {
      io.emit('help');
      debuff = true;
      setTimeout(() => {
        debuff = false;
      }, 5000);
    }
  },
}, 'What can I ask?');

const init = socket => {
  document.body.appendChild(speechToggleButton);
  document.body.appendChild(speechToggleLabel);
  document.body.appendChild(instructionLabel);
  io = socket;
};

export default {
  init,
};
