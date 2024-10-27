/* eslint-disable @typescript-eslint/no-explicit-any */

import { Socket } from 'socket.io';
import { WebSocket } from 'ws';
import { PistonRequest } from './interface';

export function initNewSubmission(webSocket: Socket) {

    webSocket.on("codelab:submit", (data: string) => {
        console.log('codelab:submit data: ', data.substring(0, 200))
        const { clientId, ...codeRequest } = JSON.parse(data)
        try {
            connectToPiston(webSocket, clientId, codeRequest)
        } catch (err) {
            console.log(err)
        }
    })

    webSocket.on("codelab:completed", (data: string) => {
        console.log('codelab:completed data: ', data)
        const { clientId } = JSON.parse(data)
        const pistonWS:WebSocket = socketRegister[clientId]
        if (pistonWS) {
            console.log('codelab:completed closing Piston for', clientId)
            pistonWS.close()
            
            // remove the socket reference
            delete socketRegister[clientId]
        } else {
            console.log('codelab:completed Piston WS Not Found: ', clientId)
        }
    })

    // NOT USED!
    webSocket.on("message", (data: string) => {
        console.log('default socket handler', data)
    });
    console.log("socketRegister count ", Object.keys(socketRegister))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketRegister: { [key: string]: any } = {}

function connectToPiston(webSocket: Socket, clientId: string, codeRequest: PistonRequest) {
    
    const pistonWS = new WebSocket(`${process.env.NEXT_INTERNAL_WS_URL}/api/v2/connect`); // Replace with actual WebSocket API endpoint
    socketRegister[`${clientId}`] = pistonWS

    // Listen for the WebSocket open event to send messages after connecting
    pistonWS.on('open', () => {
        console.log('Connected to Piston.');

        // Send an initial message if needed
        pistonWS.send(JSON.stringify({ type: 'init', ...codeRequest }));
    });

    // Listen for messages from the WebSocket server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pistonWS.on('message', (data: any) => {
        console.log('Received message from Piston:', data.toString());

        webSocket.emit("codelab:result", data.toString());
    });

    // Handle errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pistonWS.on('error', (error: any) => {
        console.error('Piston error:', error);
        webSocket.emit("codelab:error", error)
    });

    // Close WebSocket when finished
    pistonWS.on('close', () => {
        console.log('Piston connection closed for Client: ', clientId);
        delete socketRegister[clientId]
    });
}