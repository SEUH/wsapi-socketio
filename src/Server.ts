import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {WSApiResponder} from "./WSApiResponder";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket: Socket) => {
    console.log('new connection:', socket.id);
    
    const responder = new WSApiResponder();
    responder.setSend(packet => socket.emit('wsapi:response', packet));
    
    // example with wrap function
    // note: 'wrap' returns your data automatically in either invasive and non-invasive mode
    socket.on('create:user', (packet) => {
        const [resolve, reject, data] = responder.wrap(packet);
        
        let user = {
            name: 'SEUH',
            attributes: {
                location: 'world'
            }
        };
    
        resolve(user);
    });
    
    // example with direct resolve function
    // warning: keep in mind that 'packet' in non-invasive mode is a WSApi call packet.
    //          to get your data out of it you can do 'packet.data'.
    socket.on('create:street', (packet) => {
        let street = {
            name: 'SEUH',
            attributes: {
                location: 'world'
            }
        };
    
        responder.resolve(packet, street);
    });
});

httpServer.listen(3000);