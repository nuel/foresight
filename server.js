const http = require('http');
const path = require('path');
const express = require('express');
const SocketIO = require('socket.io');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const intent = require('./intent');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

const app = express();
const server = http.Server(app);
const io = SocketIO(server);

io.on('connection', (socket) => {
  socket.on('speechstart', () => {
    socket.broadcast.emit('speechstart');
  });

  socket.on('speechstop', () => {
    socket.broadcast.emit('speechstop');
  });

  socket.on('help', () => {
    socket.broadcast.emit('help');
  });
});

app.get('/intent', (req, res) => {
  if (req.query.input) {
    intent.query(req.query.input)
      .then(intents => {
        res.send(intents);
        res.end();
      })
      .catch(error => {
        console.log(error);
        console.log(error.stack);
      });
  } else {
    res.end();
  }
});

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

server.listen(port, () => {
  console.log('Time to take over the world');
});
