// import io from 'socket.io-client'
// const socket = io.connect('http://10.14.2.27:19160/ws')
// socket.on('init', data => {
// })
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'
// import { UserModule } from '@/store/modules/user';
// // var sock = new SockJS('http://10.14.2.27:19160/ws');
// const url = "http://10.14.2.27:19160/ws"
// const socket = new SockJS(url, null, { timeout: 30000 });
// const stomp = Stomp.over(socket);
// //连接
// stomp.connect({ userId: '12' }, function (frame) {
//   stomp.subscribe("/user/topic/todo", function (res:any) {
//     });
//   stomp.subscribe("/app/one", function (res:any) {
//     });
// });
// sock.onopen = function() {
//     sock.send('test');
// };

// sock.onmessage = function(e) {
//     sock.close();
// };

// sock.onclose = function() {
// };