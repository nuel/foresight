import hud from './hud';
import face from './face';
import scenarios from './scenarios';

const speak = async (message, { expression, expressionDuration } = {}) => {
  // Hacky calculation of duration based on message length
  const duration = message.length * 55;
  const utterance = new SpeechSynthesisUtterance(message);

  // Tune down for nice voice effect
  utterance.pitch = 0.3;

  // Show the response on the screen
  hud.showResponse(message, duration);

  // Play audio
  speechSynthesis.speak(utterance);

  // Display talking animation
  if (expression) {
    await face.once(expression, expressionDuration);
  }
  await face.once('talk', duration + 100);
};

const parse = async data => {
  // No intent found
  if (!data[0]) {
    speak('Sorry, I cannot answer that question. Please try another.');
    return;
  }

  const intent = data[0].intent_type.split(':');

  // Grab either the default scenario for this intent or one of its subjects
  const scenario = intent.length > 1 ?
    scenarios[intent[0]].subjects[intent[1]] :
    scenarios[intent[0]];

  let cards;

  const result = await scenario.parse(data[0]);

  await speak(result.response);
  cards = result.data;

  if (cards) {
    hud.showCards(cards);
  }
};

export default {
  speak,
  parse,
};
