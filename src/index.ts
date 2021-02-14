import { createServer, Server } from 'http'
import { logger } from '@poppinss/cliui'

export interface ServerOptions {
    port: number
}

export class App {
    public start(options: ServerOptions): void {
        const server = createServer(function(req, res){
            res.end("Hello, world!");
        })
    }
}