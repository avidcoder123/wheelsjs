import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'

let app = new App(), { Router } = app

Router.route('/:id', async function(ctx: HttpContext){
    throw new Error("Idk")
    return "Recieved param id: " + ctx.request.params.id as string
})

app.start({
    port: 8080
})