import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'
import { Router } from '../src/router'

const app = new App()

Router.route('/:id', async function(ctx: HttpContext){
    return "Recieved param id: " + ctx.request.params.id as string
})

Router.post("/", async function(ctx: HttpContext){
    return "POST is working!"
})


app.start({
    port: 8080
})