# Foresight
An Internet of Things Oracle. Final bachelor project at Eindhoven University of Technology.
A digital oracle answers questions about past, present and future, using hypothetical data from internet-connected home
appliances in a fictional household.

## How does this work?
Foresight uses `webkitSpeechRecognition` and `SpeechSynthesisUtterance` to create a voice-operated interface. The speech recognition is triggered over Socket.IO, using a web interface on a remote device, like a phone. For natural language input processing, the recognized speech is run through the Adapt Intent Parser from Mycroft A.I.

For the interface of this project, I'm doing rear projection on a semi-transparent screen that's positioned a few feet above the floor, creating the idea of a holographic display. The interface displays the oracle with various expressions that adapt to the current context. There's video involved in the interface, making it quite heavy on performance. (All expressions of the digital oracle displayed on the screen are literally just huge gifs). All of this video content is kept in memory simultaneously, something that could definitely be optimized but was the easiest way to not have any lag when switching expressions.

## Installing
First: `npm i`
Then, install adapt-parser in `/src` with `pip install -e git+https://github.com/mycroftai/adt#egg=adapt-parser`

## Running
Just `npm start`. (Or `NODE_ENV=production node server.js` when not in development, but the overhead of Webpack is negligible)
Main interface is at `0.0.0.0:3000`, remote interface at `0.0.0.0:3000/?remote=1`
