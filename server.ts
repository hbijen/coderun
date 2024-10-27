/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

const { createServer } = require("http");
const next = require("next");
const { parse } = require("url");
const { Server } = require("socket.io");
const WebSock = require('ws');

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer((req: any, res: any) => {
        try {
            const parsedUrl = parse(req.url!, true);
            handler(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    })

    try {

        const io = new Server(httpServer, { path: "/api/websocket" });

        console.log(io)

        io.on("connection", (socket: any) => {
            console.log("new ws submission")
            initNewSubmission(socket)
        });

        // initWebSocketServer(server);
    } catch (err) {
        console.error('initWebSocketServer', err);
    }

    httpServer.listen(port, () => {
        console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
    })
});


function initNewSubmission(wss: any) {

    wss.on("codelab:submit", (data: string) => {
        console.log('codelab:submit data: ', data.substring(0, 200))
        const { clientId, ...codeRequest } = JSON.parse(data)
        try {
            connectToPiston(wss, clientId, codeRequest)
        } catch (err) {
            console.log(err)
        }
    })

    wss.on("codelab:completed", (data: string) => {
        console.log('codelab:completed data: ', data)
        const { clientId } = JSON.parse(data)
        const pistonWS = socketRegister[clientId]
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
    wss.on("message", (data: string) => {
        console.log('default socket handler', data)
    });
    console.log("socketRegister count ", Object.keys(socketRegister))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketRegister: { [key: string]: any } = {}

function connectToPiston(wss: any, clientId: string, codeRequest: any) {
    
    const pistonWS: any = new WebSock(`${process.env.NEXT_INTERNAL_WS_URL}/api/v2/connect`); // Replace with actual WebSocket API endpoint
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

        wss.emit("codelab:result", data.toString());
    });

    // Handle errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pistonWS.on('error', (error: any) => {
        console.error('Piston error:', error);
        wss.emit("codelab:error", error)
    });

    // Close WebSocket when finished
    pistonWS.on('close', () => {
        console.log('Piston connection closed for Client: ', clientId);
        delete socketRegister[clientId]
    });
}