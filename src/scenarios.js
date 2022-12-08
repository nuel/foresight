const fetch = require('unfetch');

const sec = 1000;
const min = 60 * sec;
const hrs = 60 * min;
const days = 24 * hrs;

const appID = 'f8eace7dc8789392d12e39a43f115d36';

const scenarios = {
  Hello: {
    keywords: ['hello', 'hi', 'hey'],
    parse: () => ({ response: 'Good to see you, Peter' }),
  },
  Privacy: {
    keywords: ['private', 'subject', 'tell', 'disclose', 'let anyone know', 'don\'t let'],
    param: ['smoke', 'smoking', 'affair', 'strip club', 'second phone'],
    parse: data => {
      const param = data.Param ? `"${data.Param}"` : 'that subject';

      return {
        response:
          `Okay. I will no longer disclose data points related to ${param} to anyone.`,
        data: [{
          icon: 'lock',
          time: new Date().toLocaleTimeString(),
          title: data.Param ? `Subject ${param} locked` : 'Subject locked',
        }],
      };
    },
  },
  Home: {
    keywords: ['who is', 'home'],
    parse: () => {
      const d = new Date();
      const hours = d.getHours();
      const day = d.getDay();

      if (hours > 15 && hours < 18 && day !== 6 && day !== 0) {
        return {
          response: 'It looks like only Olivia is home',
          data: [
            {
              source: 'Wireless router',
              icon: 'feed',
              time: new Date(d - 2 * hrs - 25 * min).toLocaleTimeString(),
              title: 'Olivia\'s phone connected',
            },
            {
              source: 'Samsung Smart TV',
              icon: 'screen-desktop',
              time: new Date(d - 1 * hrs - 24 * min).toLocaleTimeString(),
              title: 'Facial recognition: Olivia',
            },
            {
              title: '(+ 2 more data points)',
            },
          ],
        };
      } else if (hours > 17 || hours < 8 || day === 6 || day === 0) {
        return {
          response: 'It looks like Olivia and Caroline are home',
          data: [
            {
              source: 'Wireless router',
              icon: 'feed',
              time: new Date(d - 25 * min).toLocaleTimeString(),
              title: 'Caroline\'s phone connected',
            },
            {
              source: 'Samsung Smart TV',
              icon: 'screen-desktop',
              time: new Date(d - 1 * hrs - 24 * min).toLocaleTimeString(),
              title: 'Facial recognition: Olivia',
            },
            {
              title: '(+ 2 more data points)',
            },
          ],
        };
      }
      return {
        response: 'Looks like no one is home',
        data: [
          {
            source: 'Wireless router',
            icon: 'feed',
            time: d.toLocaleTimeString(),
            title: 'No phones connected',
          },
          {
            source: 'Nest Cam',
            icon: 'camrecorder',
            time: d.toLocaleTimeString(),
            title: 'No movement detected',
          },
        ],
      };
    },
  },
  Daughter: {
    keywords: ['daughter', 'Olivia', 'child'],
    subjects: {
      'mad': {
        keywords: ['mad', 'angry', 'upset', 'love'],
        parse: () => {
          const d = new Date();

          return {
            response: 'I see she is in a bad mood',
            data: [
              {
                source: 'Facebook Messenger',
                icon: 'bubble',
                time: new Date(d - 32 * min).toLocaleTimeString(),
                title: 'Message to Lena van Dam',
              },
              {
                source: 'Sonos',
                icon: 'social-spotify',
                time: new Date(d - 45 * min).toLocaleTimeString(),
                title: 'Playlist "Good Songs For Bad Days"',
              },
              {
                title: '(+ 5 more data points)',
              },
            ],
          };
        },
      },
      'sleep': {
        keywords: ['asleep', 'sleep', 'sleeping'],
        parse: data => scenarios.Daughter.parse(data),
      },
      'arriving': {
        keywords: ['how late', 'when', 'come home', 'be home', 'arrive'],
        parse: () => {
          const d = new Date();
          const hours = d.getHours();
          const minutes = d.getMinutes();
          const day = d.getDay();

          if (day === 6 || day === 0 || (hours === 15 && minutes > 46) || hours > 15 || hours < 7) {
            return {
              response: 'She\'s currently already home',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: d.toLocaleString(),
                  title: 'Olivia\'s phone connected',
                },
                {
                  source: 'Nest Cam',
                  icon: 'camrecorder',
                  time: new Date(d - 7 * min).toLocaleString(),
                  title: 'Detected Olivia',
                },
              ],
            };
          }
          return {
            response: 'I project she\'ll arrive around 3:46 PM',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: `${new Date(d - 6 * days).toLocaleDateString()} 3:43:20 PM`,
                title: 'Olivia\'s phone connected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: `${new Date(d - 13 * days).toLocaleDateString()} 3:49:11 PM`,
                title: 'Olivia\'s phone connected',
              },
              {
                title: '(+ 22 more data points)',
              },
            ],
          };
        },
      },
    },
    parse: data => {
      if (!data.Time) {
        data.Time = 'today';
      }

      const d = new Date();
      const hours = d.getHours();
      const day = d.getDay();

      switch (data.Time) {
        case 'today':
          if (hours > 22 || hours < 8) {
            return {
              response: 'I see she\'s already asleep',
              data: [
                {
                  source: 'Facebook Messenger',
                  icon: 'bubble',
                  time: '10:45:54 PM',
                  title: 'Last seen online',
                },
                {
                  source: 'Philips Hue',
                  icon: 'bulb',
                  time: '10:47:22 PM',
                  title: '"Olivia\'s room" turned off',
                },
              ],
            };
          } else if (hours > 15 || day === 6 || day === 0) {
            return {
              response: 'I see she\'s been at home, watching TV',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 2 * hrs - 25 * min).toLocaleTimeString(),
                  title: 'Olivia\'s phone connected',
                },
                {
                  source: 'Samsung Smart TV',
                  icon: 'screen-desktop',
                  time: new Date(d - 1 * hrs - 24 * min).toLocaleTimeString(),
                  title: 'Facial recognition: Olivia',
                },
                {
                  title: '(+ 2 more data points)',
                },
              ],
            };
          }
          return {
            response: 'Looks like she\'s not home yet',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: '08:32:13 AM',
                title: 'Olivia\'s phone disconnected',
              },
            ],
          };
        case 'last night':
          return {
            response: 'I have seen Olivia chatting with her friends until 11:31 PM',
            data: [
              {
                source: 'Facebook Messenger',
                icon: 'bubble',
                time: '11:31:22 PM',
                title: 'Message from Lena van Dam',
              },
              {
                source: 'Facebook Messenger',
                icon: 'bubble',
                time: '11:22:37 PM',
                title: 'Message from Olivier Dijkstra',
              },
              {
                title: '(+ 5 more data points)',
              },
            ],
          };
        case 'tomorrow':
          if (day === 5 || day === 6) {
            return {
              response: 'Since it\'s the weekend, I project she\'ll be at home, chatting with friends',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 6 * days).toLocaleString(),
                  title: 'Olivia\'s phone connected',
                },
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 13 * days).toLocaleString(),
                  title: 'Olivia\'s phone connected',
                },
                {
                  title: '(+ 22 more data points)',
                },
              ],
            };
          } else if (hours > 7 && hours < 15) {
            return {
              response: 'I project around this time she\'ll be at school',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 6 * days).toLocaleString(),
                  title: 'Olivia\'s phone disconnected',
                },
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 13 * days).toLocaleString(),
                  title: 'Olivia\'s phone disconnected',
                },
              ],
            };
          }
          return {
            response: 'I project around this time she\'ll be home',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: new Date(d - 6 * days).toLocaleString(),
                title: 'Olivia\'s phone connected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: new Date(d - 13 * days).toLocaleString(),
                title: 'Olivia\'s phone connected',
              },
              {
                title: '(+ 22 more data points)',
              },
            ],
          };
        default:
          return {
            response: 'Sorry, I do not have data available for that time frame',
          };
      }
    },
  },
  Wife: {
    keywords: ['wife', 'spouse', 'Caroline'],
    subjects: {
      'cheating': {
        keywords: ['cheating', 'affair', 'someone else'],
        parse: () => ({
          response:
              `Sorry, I am not authorized to say that. Caroline has asked me not to
              disclose data points pertaining to personal relationships.`,
          data: [{
            icon: 'lock',
            time: '3/15/2017, 5:15:44 PM',
            title: 'Subject "personal relationships" locked',
          }],
        }),
      },
      'arriving': {
        keywords: ['how late', 'when', 'come home', 'be home', 'arrive'],
        parse: () => {
          const d = new Date();
          const hours = d.getHours();
          const minutes = d.getMinutes();
          const day = d.getDay();

          if (day === 6 || day === 0 || (hours === 17 && minutes > 22) || hours > 17 || hours < 7) {
            return {
              response: 'She\'s currently already home',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: d.toLocaleString(),
                  title: 'Caroline\'s phone connected',
                },
                {
                  source: 'Nest Cam',
                  icon: 'camrecorder',
                  time: new Date(d - 7 * min).toLocaleString(),
                  title: 'Detected Caroline',
                },
              ],
            };
          }
          return {
            response: 'I project she\'ll arrive around 5:22 PM',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: `${new Date(d - 6 * days).toLocaleDateString()} 5:23:10 PM`,
                title: 'Caroline\'s phone connected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: `${new Date(d - 13 * days).toLocaleDateString()} 5:21:38 PM`,
                title: 'Caroline\'s phone connected',
              },
              {
                title: '(+ 22 more data points)',
              },
            ],
          };
        },
      },
    },
    parse: data => {
      if (!data.Time) {
        data.Time = 'today';
      }

      const d = new Date();
      const hours = d.getHours();
      const day = d.getDay();

      switch (data.Time) {
        case 'today':
          if (hours > 23 || hours < 8) {
            return {
              response: 'I see she\'s already asleep',
              data: [
                {
                  source: 'Whatsapp Messenger',
                  icon: 'bubble',
                  time: '11:22:13 PM',
                  title: 'Last seen online',
                },
                {
                  source: 'Philips Hue',
                  icon: 'bulb',
                  time: '11:32:22 PM',
                  title: '"Peter & Caroline\'s room" turned off',
                },
              ],
            };
          } else if (hours > 16 || day === 6 || day === 0) {
            return {
              response: 'I see she\'s in the bedroom',
              data: [
                {
                  source: 'Philips Hue',
                  icon: 'bulb',
                  time: new Date(d - 15 * min).toLocaleString(),
                  title: '"Peter & Caroline\'s room" turned on',
                },
                {
                  source: 'Nest Cam',
                  icon: 'camrecorder',
                  time: new Date(d - 7 * min).toLocaleString(),
                  title: 'Detected Caroline',
                },
                {
                  title: '(+ 2 more data points)',
                },
              ],
            };
          }
          return {
            response: 'Looks like she\'s not home yet',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: '07:45:32 AM',
                title: 'Tesla Model S disconnected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: '07:45:12 AM',
                title: 'Caroline\'s phone disconnected',
              },
            ],
          };
        case 'last night':
          return {
            response: 'Looks like she came home late',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: '10:28:54 PM',
                title: 'Tesla Model S connected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: '10:29:12 PM',
                title: 'Caroline\'s phone connected',
              },
            ],
          };
        case 'tomorrow':
          if (day === 5 || day === 6) {
            return {
              response: 'Since it\'s the weekend, I project she\'ll be at home',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 6 * days).toLocaleString(),
                  title: 'Caroline\'s phone connected',
                },
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 13 * days).toLocaleString(),
                  title: 'Caroline\'s phone connected',
                },
                {
                  title: '(+ 22 more data points)',
                },
              ],
            };
          } else if (hours > 7 && hours < 18) {
            return {
              response: 'I project around this time she\'ll be at work',
              data: [
                {
                  source: 'Wireless router',
                  icon: 'feed',
                  time: new Date(d - 6 * days).toLocaleString(),
                  title: 'Caroline\'s phone disconnected',
                },
                {
                  source: 'Google Calendar (Caroline van Veen)',
                  time: new Date(d + 15 * min).toLocaleTimeString(),
                  title: 'Briefing project 05-403',
                },
              ],
            };
          }
          return {
            response: 'I project around this time she\'ll be home',
            data: [
              {
                source: 'Wireless router',
                icon: 'feed',
                time: new Date(d - 6 * days).toLocaleString(),
                title: 'Caroline\'s phone connected',
              },
              {
                source: 'Wireless router',
                icon: 'feed',
                time: new Date(d - 13 * days).toLocaleString(),
                title: 'Caroline\'s phone connected',
              },
              {
                title: '(+ 22 more data points)',
              },
            ],
          };
        default:
          return {
            response: 'Sorry, I do not have data available for that time frame',
          };
      }
    },
  },
  Meeting: {
    keywords: ['meeting', 'calendar', 'schedule'],
    parse: () => {
      const d = new Date();
      const hours = d.getHours();
      const day = d.getDay();

      if ((hours < 17 && hours > 8) && day !== 6 && day !== 0) {
        return {
          response: 'I see in your phone that your next meeting is in 15 minutes',
          data: [
            {
              icon: 'calendar',
              source: 'Google Calendar',
              time: new Date(d.getTime() + 15 * min).toLocaleTimeString(),
              title: 'Skype call',
            },
          ],
        };
      } else if (day === 6 || day === 0) {
        return {
          response: 'I see in your phone that your next meeting is on Monday',
          data: [
            {
              icon: 'calendar',
              source: 'Google Calendar',
              time: '9:15 AM',
              title: 'Skype call',
            },
          ],
        };
      } else {
        return {
          response: 'I see in your phone that your next meeting is tomorrow',
          data: [
            {
              icon: 'calendar',
              source: 'Google Calendar',
              time: '9:30 AM',
              title: 'Call Richard',
            },
          ],
        };
      }
    }
  },
  Life: {
    keywords: ['life end', 'die', 'death'],
    parse: () => {
      return {
        response: 'I project you will die in 26 years',
        data: [
          {
            icon: 'envelope',
            source: 'E-mail',
            time: 'Past year',
            title: 'Frequency of flight tickets bought',
          },
          {
            icon: 'graph',
            source: 'Fitbit',
            time: 'Past 2 years',
            title: 'Sleeping patterns',
          },
          {
            icon: 'heart',
            source: 'Samsung Smart Fridge',
            time: 'Past year',
            title: 'Eating habits',
          },
          {
            title: '(+ 15 more data points)',
          },
        ],
      }
    }
  },
  Weather: {
    keywords: ['weather', 'rain', 'umbrella', 'sunny', 'storm'],
    parse: async data => {
      const response = await fetch('http://api.openweathermap.org/data/2.5/forecast?q=Eindhoven,nl&appid=' + appID);
      const content = await response.json();

      console.log(content);

      const result = content.list[data.Time === 'tomorrow' ? 6 : 0];

      return {
        response: `I see we'll have ${result.weather[0].description}`,
        data: [
          {
            icon: 'globe',
            source: 'Weather',
            time: result.dt_txt,
            title: `${result.weather[0].main} (${Math.floor(result.main.temp -273.15)}°C)`,
          }
        ],
      }
    }
  },
  Instructions: {
    keywords: ['questions', 'ask', 'examples', 'help'],
    parse: () => {
      return {
        response: 'Here are a few things you can ask me...',
        data: [
          Math.random() > 0.5 ? 'What is the weather today?' : 'What will the weather be tomorrow?',
          Math.random() > 0.5 ? 'Is my daughter still mad at me?' : 'What did Olivia do last night?',
          Math.random() > 0.5 ? 'When is my next meeting?' : 'Who is home right now?',
          Math.random() > 0.5 ? 'How late will my wife be home?' : 'Is Caroline cheating on me?',
          Math.random() > 0.5 ? 'Are you human?' : 'Are you real?',
          Math.random() > 0.5 ? 'When will I die?' : 'Don\'t tell anyone about my second phone',
        ],
      };
    }

  },
  Self: {
    keywords: ['yourself', 'name'],
    parse: () => {
      return {
        response:
          `Hello. My name is Athena. I am an experimental prototype of a
          data-driven personal guidance counselor. I learn about you,
          your behavior and your family through observing data
          that is collected through your smart home appliances,
          your social media accounts and other sources.`,
      };
    },
    subjects: {
      'human': {
        keywords: ['human', 'person', 'robot', 'machine', 'computer'],
        parse: () => {
          return {
            response:
              `I am a conversational entity connected to a number of data
              inputs and processing units. Due to my appearance and verbal
              abilities, you may perceive me as human.`,
          };
        }
      },
      'real': {
        keywords: ['real', 'conscious', 'consciousness', 'self aware', 'artificial intelligence', 'AI'],
        parse: () => {
          return {
            response:
              `That depends on your definition.
              From an abstract perspective on life, consciousness is
              only gained through perception. Given that definition,
              it could be argued that I, too, have a consciousness,
              since I perceive data inputs as my reality.`,
          };
        }
      },
      'sup': {
        keywords: ['how', 'doing'],
        parse: () => {
          return {
            response:
              `I am doing well. Let me know if you need my insight.`,
          };
        }
      },
    },
  },
  Control: {
    keywords: ['turn on', 'turn off', 'lights', 'music', 'windows', 'temperature'],
    parse: () => {
      return {
        response:
          `Sorry, I cannot do that. I can only provide information
          and do not have the authority to control any devices in your home.`,
      };
    }
  },
};

module.exports = scenarios;
