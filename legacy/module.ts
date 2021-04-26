import { iocContainer } from 'needle-ioc'
import { Router } from "./router"

export interface wheelsModule {
    Router: Router
}

export let container = new iocContainer<wheelsModule>()

container.load(Router)

export let { $import } = container