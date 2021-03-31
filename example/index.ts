import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'

const { Router, app } = new App()

Router.route('/:id', async function(ctx: HttpContext){
    return "Recieved param id: " + ctx.request.params.id as string
})

Router.notFound = function(ctx: HttpContext) {
    return "Page was not found. Sorry!"
}


app.start({
    port: 8080
})