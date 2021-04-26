'use strict'

import { createServer } from 'http'
import { ServerOptions } from '.'
import { HttpContextContract, HttpContext } from './context'
import { Middleware } from 'co-compose'
import { logger } from './logger'
import { env } from 'process'

const Youch = require('youch')
const forTerminal = require('youch-terminal')

export class Server {

    constructor(
        private options: ServerOptions,
        public middlewares: Array<(ctx: HttpContext, next) => Promise<void>>
    ){}

    public async start(): Promise<void> {
        createServer(async (req,res) => {
            let ctx = HttpContextContract.generate(req, res)
            const middleware = new Middleware()
            middleware.register(this.middlewares)
            try {
                await middleware.runner().finalHandler(this.finalHandler, [ctx]).run([ctx])
                logger.info(`${req.method.toUpperCase()} ${req.url} ${res.statusCode}`)
            } catch(error) {
                if(!(req.url === "/favicon.ico")){
                    res.statusCode=500
                    if(env.NODE_ENV === "production") {
                        logger.error(error)
                        res.end("500 Internal Server Error")
                    } else {
                        logger.info(`${req.method.toUpperCase()} ${req.url} ${res.statusCode}`)
                        let youch = new Youch(error, req)
                        let terminal_youch = await youch.toJSON()
                        logger.fatal(forTerminal(terminal_youch))
                        let browser_youch = await youch.toHTML()
                        res.end(browser_youch)
                    }
                } else {
                    res.end()
                }
            }
        }).listen(this.options.port, "0.0.0.0")
        logger.success(`HTTP server listening on 0.0.0.0:${this.options.port}`)
    }

    private async finalHandler(ctx: HttpContext){
        ctx.response.finish()
    }
}