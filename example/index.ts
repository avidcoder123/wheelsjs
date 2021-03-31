import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'

const app = new App()
let { Router } = app

Router.route('/:id', async function(ctx: HttpContext){
    return "Recieved param id: " + ctx.request.params.id as string
})


app.start({
    port: 8080
})