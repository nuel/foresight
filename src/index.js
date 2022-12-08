import io from 'socket.io-client';
import face from './face';
import request from './request';
import response from './response';
import remote from './remote';
import sound from './sound';
import './theme/style.scss';

const socket = io();

const params = new URLSearchParams(location.search);

if (!params.get('remote')) {
  socket.on('speechstart', request.listen);
  socket.on('speechstop', request.process);
  socket.on('help', () => request.fromString('What can I ask you?'));

  face.init('idle');
} else {
  document.ontouchstart = e => { e.preventDefault(); };
  remote.init(socket);
}

sound.init();
window.r = request;
window.s = response;
window.onkeypress = e => {
  if (e.key === 'z') {
    request.listen();
  }
  if (e.key === 'x') {
    request.process();
  }
};
