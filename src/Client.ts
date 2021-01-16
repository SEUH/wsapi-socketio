import {io} from 'socket.io-client';
import {WSApi} from "./WSApi";

const socket = io('ws://localhost:3000');

socket.on("connect", () => {
    console.log('connected');
    
    createUser();
});

socket.on("disconnect", () => {
    console.log('disconnected');
});


const api = new WSApi(true);
api.setSend((event, packet) => {
    console.log('send', event, packet);
    return socket.emit(event, packet)
});
socket.on('wsapi:response', packet => api.resolvePacket(packet));

async function createUser() {
    let user = await api.call('create:user', {
        name: 'SEUH',
    });
    
    console.log('created new user', user);
}
