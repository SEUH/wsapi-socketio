import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {WSApi, WSApiStatus} from "./WSApi";

const httpServer = createServer();
const io = new Server(httpServer);

class WSApiResponder {
    private sendFunc;
    
    setSend(sendFunc) {
        this.sendFunc = sendFunc;
    }
    
    reply(forPacket, status, ...rest) {
        if (!this.sendFunc) {
            throw new Error('WSApi: No send function defined!');
        }
    
        rest[rest.length - 1] = this.createResponse(forPacket, status, rest[rest.length - 1]);
        
        return this.sendFunc(...rest);
    }
    
    createResponse(forPacket, status, data) {
        console.log('createResponse', status, data);
        
        if (this.checkIsInvasive(forPacket)) {
            return WSApi.createInvasiveResponse(forPacket, status, data);
        }
        
        return WSApi.createResponse(forPacket, status, data);
    }
    
    checkIsInvasive(packet) {
        return typeof packet === 'object' && packet._wsapiId !== undefined;
    }
    
    wrap(packet) {
        return [
            (...rest) => this.resolve(packet, ...rest),
            (...rest) => this.reject(packet, ...rest),
            this.checkIsInvasive(packet) ? packet : packet.data,
        ];
    }
    
    resolve(packet, ...rest) {
        return this.reply(packet, WSApiStatus.RESOLVED, ...rest);
    }
    
    reject(packet, ...rest) {
        return this.reply(packet, WSApiStatus.REJECTED, ...rest);
    }
}

io.on("connection", (socket: Socket) => {
    console.log(socket.id);
    
    const responder = new WSApiResponder();
    responder.setSend(packet => {
        console.log('response', packet);
        return socket.emit('wsapi:response', packet)
    });
    
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