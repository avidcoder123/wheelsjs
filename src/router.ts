import { exec, parse, match, Route, Segment } from 'matchit'
import { HttpContext } from './context'

interface RouteHandler {
    method: string,
    handler: Function
}

declare module '@poppinss/request' {
    interface Request {
        params: any
    }
}

export class Router {
    private static routes: Array<Route> = []

    private static methods: Array<RouteHandler> = []

    public static get(route: string, handler: Function) {
        let parsedRoute: Route = parse(route)
        this.routes.push(parsedRoute)
        this.methods[JSON.stringify(parsedRoute)] = {
            method: "GET",
            handler: handler
        }
    }

    public static async handle(ctx: HttpContext, next){
        const url = ctx.request.parsedUrl.href
        const matched = match(url, Router.routes)
        const route_serial = JSON.stringify(matched)
        let routeData: RouteHandler
        if(Router.methods[route_serial]) {
            routeData = Router.methods[route_serial]
            if(ctx.request.method() === routeData.method) {
                const params = exec(url, matched)
                ctx.request.params = params
                await routeData.handler(ctx)
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