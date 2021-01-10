import io from 'socket.io-client';

const socket = io.connect();

socket.on('connect', () => {
    console.log('on connect');
});

socket.on("connect_error", () => {
    console.log('on connect error');
});

export interface IWSEvent {
    message: ISyncPayload;
}

export interface ISyncPayload {
    operation: 'update' | 'updateHead' | 'changeValue' | 'changeChecked' | 'scroll' | 'mouse',
    selector: string,
    value?: string | object,
}

export function sendMessage({
    operation,
    selector,
    value,
}: ISyncPayload) {
    console.log('sendMessage', operation, selector, value);

    socket.emit('sync', {
        operation,
        value,
        selector,
    });
}

export function addSocketListener(cb: (message: ISyncPayload) => void) {
    socket.on('sync', (event: IWSEvent) => {
        console.log('Updater - Receive event: ', event.message);
        cb(event.message);
    });
}