import StartupClass from "../contracts/startup"
import "reflect-metadata"
import { container, InjectionToken } from 'tsyringe'

export function bootstrap <T extends InjectionToken>(startup: T) {
    let opts = container.resolve<T>(startup) as unknown as StartupClass
    
}