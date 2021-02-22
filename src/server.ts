'use strict'

import { IncomingMessage, ServerResponse, createServer } from 'http'
import { ServerOptions } from '.'
import { HttpContextController, HttpContext } from './context'
import { Middleware } from 'co-compose'
import { logger } from '@poppinss/cliui'

const Youch = require('youch')
const forTerminal = require('youch-terminal')

export class Server {

    constructor(
        private options: ServerOptions,
        private middlewares: Function[]
    ){}

    public async start(): Promise<void> {
        createServer(async (req,res) => {
            let ctx = HttpContextController.generate(req, res)
            const middleware = new Middleware()
            middleware.register(this.middlewares)
            try {
                await middleware.runner().finalHandler(this.finalHandler, [ctx]).run([ctx])
            } catch(error) {
                logger.fatal("FATAL: Error in application")
                let youch = new Youch(error, req)
                let terminal_youch = await youch.toJSON()
                console.log(forTerminal(terminal_youch))
                let browser_youch = await youch.toHTML()
                res.writeHead(200, {'content-type': 'text/html'})
                res.end(browser_youch)
            }
        }).listen(this.options.port)
    }

    private async finalHandler(ctx: HttpContext){
        ctx.response.finish()
    }
}