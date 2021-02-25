import { exec, parse, match, Route, Segment } from 'matchit'
import { HttpContext } from './context'

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

    public route(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "*",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public get(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "GET",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public post(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "POST",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public put(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "PUT",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public delete(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "DELETE",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public patch(route: string, handler: Function, opts?: RouteOptions) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "PATCH",
            handler: handler,
            opts: opts ? opts : null
        }
    }

    public async handle(ctx: HttpContext, next){
        const url = ctx.request.parsedUrl.href
        const matched = match(url, this.routes)
        const route_serial = JSON.stringify(matched)
        let routeData: RouteHandler
        if(this.methods[route_serial]) {
            routeData = this.methods[route_serial]
            if(routeData.method === "*" || ctx.request.method() === routeData.method) {
                const params = exec(url, matched)
                ctx.request.params = params
                let handlerResponse = await routeData.handler(ctx)
                if(handlerResponse) {
                    ctx.response.send(handlerResponse)
                }
                await next()
            } else {
                ctx.response.status(405)
                ctx.response.send("405 Method Not Allowed")
                await next()
            }
        } 
        else {
            ctx.response.status(404)
            ctx.response.send("404 Not Found")
            await next()
        }
        
    }
}