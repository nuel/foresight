import h from 'hyperscript';

// All expressions and their durations
const expressions = {
  idle: 9.3,
  lookaway: 9.0,
  nod: 0.9,
  notice: 10.8,
  talk: 1.2,
};

const expressionElements = {};

// Local state element for 'once' events
let currentExpression;

// Create elements
Object.keys(expressions).map(expression => (
  expressionElements[expression] = h('div.expression', {
    style: {
      'background-image': `url('/public/face/${expression}.gif')`,
    },
  })
));

// Append all elements, hide all but default
const init = initialExpression => {
  for (const expression in expressionElements) {
    document.getElementById('expressions').appendChild(expressionElements[expression]);
  }
  change(currentExpression = initialExpression);
};

// Hide all elements except selected expression
const change = expression => {
  if (!expressionElements[expression]) return false;

  Object.keys(expressionElements).map(
    key => expressionElements[key].classList[expression === key ? 'remove' : 'add']('hidden')
  );

  currentExpression = expression;
  return true;
};

// Change expression, return to previous after it finished playing
const once = (expression, duration) => {
  const previousExpression = currentExpression;
  change(expression);
  return new Promise(resolve => setTimeout(() => {
    change(previousExpression);
    change('idle');
    resolve();
  }, duration || expressions[expression] * 1000));
};

export default {
  init,
  once,
  change,
};
