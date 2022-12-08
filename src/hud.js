import h from 'hyperscript';

// Create HUD elements
const responseText = h('span.interface-text');
const requestFinal = h('span.request-final.interface-text');
const requestInterim = h('span.request-interim.interface-text');
const responseBox = h('div.response-box', responseText);
const requestBox = h('div.request-box', requestFinal, requestInterim);
const cardContainer = h('div.card-container');
const speakNow = h('div.speak-now.hidden', 'Speak now');

// Append elements
document.body.appendChild(responseBox);
document.body.appendChild(requestBox);
document.body.appendChild(cardContainer);
document.body.appendChild(speakNow);

// Show some text, then hide it
const showResponse = (message, duration) => {

  // Break message into words
  const words = message.split(' ');

  let displayMessage = '';
  let i = 0;

  // Loop through words
  const addWord = () => {
    if (i < words.length) {
      displayMessage += `${words[i]} `;
      responseText.innerHTML = displayMessage;
      i++;
    } else {
      clearInterval(loop);
    }
  };

  addWord();
  const loop = setInterval(addWord, duration / words.length);
};

const showCards = cards => {
  cards.map(card => {
    if (typeof card === 'string') {
      cardContainer.appendChild(h('div.card', card));
    } else {
      const { source, time, title, data, icon } = card;
      cardContainer.appendChild(h('div.card',
        time ? h('div.card-time', time) : '',
        source ? h('div.card-source', source) : '',
        title ? h('div.card-title', icon ? h(`i.icon-${icon}.icons`) : '', title) : '',
        data ? h('div.card-data', data) : '',
      ));
    }

    return card;
  });
};

export default {
  showResponse,
  showCards,
  requestFinal,
  requestInterim,
  responseText,
  cardContainer,
  speakNow,
};
