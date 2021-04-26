import StartupClass from "../contracts/startup"
import "reflect-metadata"
import { container, InjectionToken } from 'tsyringe'
import Server from "./server"

export function bootstrap <T extends InjectionToken>(startup: T) {
    let opts = container.resolve(startup) as unknown as StartupClass
    let server: Server = container.resolve(Server)
    server.serve(opts.port)
}