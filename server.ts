/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServer } from "http";
import next from "next";
import { parse } from "url";

import { Server } from "socket.io";
import { initNewSubmission } from "./src/lib/websocket";

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

        const io = new Server(httpServer, {path: "/api/websocket"});

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