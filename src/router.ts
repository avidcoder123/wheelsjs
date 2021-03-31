import { exec, parse, match, Route, Segment } from 'matchit'
import { HttpContext } from './context'
import { wheelsModule } from './module'
import { iocContainer } from 'needle-ioc'

interface RouteHandler {
    method: string,
    handler: Function,
    opts?: RouteOptions
}

declare module '@poppinss/request' {
    interface Request {
        params: any
    }
}

interface RouteOptions {
    middlewares?: Array<(ctx: HttpContext, next) => Promise<void>>
}

export class Router {
    private routes: Array<Route> = []

    private methods: Array<RouteHandler> = []

    public notFound: Function

    public route(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "*",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public handle = async (ctx: HttpContext, next) => {
        const url = ctx.request.parsedUrl.href
        const matched = match(url, this.routes)
        const route_serial = JSON.stringify(matched)
        let routeData: RouteHandler
        if(this.methods[route_serial]) {
            routeData = this.methods[route_serial]
            const params = exec(url, matched)
            ctx.request.params = params
            let handlerResponse = await routeData.handler(ctx)
            if(handlerResponse) {
                ctx.response.send(handlerResponse)
            }
            await next()
        } 
        else {
            ctx.response.status(404)
            ctx.response.send(await this.notFound(ctx))
            await next()
        }
        
    }

    public static bind(container: iocContainer<wheelsModule>) {
        container.singleton(
            "Router",
            "Wheels/Core/Router",
            () => new Router()
        )
    }
}