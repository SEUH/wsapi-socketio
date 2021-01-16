# WSApi socket.io proof of concept

This is [WSApi](https://github.com/SEUH/wsapi) implemented with [socket.io](https://socket.io/) as a proof of concept.

### Goal (successful)

The goal is to get a return value from a socket event call. Socket.io uses Websockets, bidirectional sockets.

```js
// here we can use await to wait for the return value
let user = await api.call('create:user', {
    name: 'SEUH',
});
```

And on the server side to be as simple to use as possible.

```js
socket.on('create:user', (packet) => {
    const [resolve, reject, data] = responder.wrap(packet);
    
    // fake new user data
    let user = {
        name: data.name,
        attributes: {
            location: 'world'
        }
    };

    resolve(user);
});
```

