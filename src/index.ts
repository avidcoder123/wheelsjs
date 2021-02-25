'use strict'
/* 
 * Wheels-lite by AvidCoder123
 * 
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { logger } from './logger'
import { Server } from './server'
import { Router } from './router'
import { HttpContext } from './context'

export interface ServerOptions {
    port: number
}

export class App {

    public Router = new Router()

    public middlewares: Array<(ctx: HttpContext, next) => Promise<void>> = [this.Router.handle]

    public async start(options: ServerOptions): Promise<void> {
        if(options.port) {
            logger.info(`Starting server...`)
            const server = new Server(options, this.middlewares)
            await server.start()
        } else {
            logger.fatal("FATAL: app.start requires option port")
        }
    }

    public before(middleware: (ctx: HttpContext, next) => Promise<void>): void {
        this.middlewares.unshift(middleware);
    }

    public after(middleware: (ctx: HttpContext, next) => Promise<void>): void {
        this.middlewares.push(middleware)
    }
}