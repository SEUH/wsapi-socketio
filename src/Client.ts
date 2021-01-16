import {io} from 'socket.io-client';
import {WSApi} from "./WSApi";

// setup socket.io
const socket = io('ws://localhost:3000');
socket.on("connect", () => {
    console.log('connected');
    
    createUser();
});
socket.on("disconnect", () => {
    console.log('disconnected');
});

// setup wsapi with socket.io
const api = new WSApi(true);
api.setSend((event, packet) => socket.emit(event, packet));
socket.on('wsapi:response', packet => api.resolvePacket(packet));

// example async function
async function createUser() {
    
    let user = await api.call('create:user', {
        name: 'SEUH',
    });
    
    console.log('created new user', user);
    
}