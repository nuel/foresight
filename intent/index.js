const adapt = require('adaptjs');
const scenarios = require('../src/scenarios');

const builder = new adapt.EngineBuilder();

// Time modifiers
builder.entity('Time', [
  'last month',
  'last week',
  'yesterday',
  'last night',
  'today',
  'tonight',
  'tomorrow',
  'next week',
  'next month',
]);

Object.keys(scenarios).map(intent => {
  // Create entity for Adapt parser
  const keywordIndex = `${intent}Keywords`;
  const scenario = scenarios[intent];
  builder.entity(keywordIndex, scenario.keywords);

  if (scenario.param) {
    builder.entity('Param', scenario.param);
  }

  // Create a possible intent using the keyword entity and optional time modifiers
  builder.intent(intent)
    .require(keywordIndex)
    .optionally('Param')
    .optionally('Time');

  if (scenario.subjects) {
    Object.keys(scenario.subjects).map(subject => {
      const subjectKeywordIndex = `${subject}Keywords`;
      builder.entity(subjectKeywordIndex, scenario.subjects[subject].keywords);

      // Create a possible subject using the keyword entity and subject keywords
      builder.intent(`${intent}:${subject}`)
        .require(keywordIndex)
        .require(subjectKeywordIndex);

      return true;
    });
  }

  return keywordIndex;
});

const engine = builder.build();

module.exports = engine;
