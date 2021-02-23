import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'
import { Router } from '../src/router'

const app = new App()

Router.get('/:id',async function(ctx: HttpContext){
    ctx.response.send("Recieved param id: " + ctx.request.params.id)
})

app.use(Router.handle)


app.start({
    port: 8080
})