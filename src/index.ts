'use strict'
/* 
 * Wheels-lite by AvidCoder123
 * 
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { logger } from '@poppinss/cliui'
import { Server } from './server'

export interface ServerOptions {
    port: number
}

export class App {

    private middlewares: Function[] = []

    public async start(options: ServerOptions): Promise<void> {
        if(options.port) {
            logger.success(`Starting Wheels HTTP server at 0.0.0.0:${options.port}`)
            const server = new Server(options, this.middlewares)
            await server.start()
        } else {
            logger.fatal("FATAL: app.start requires option port")
        }
    }

    public use(middleware: Function): void {
        this.middlewares.push(middleware);
    }
}