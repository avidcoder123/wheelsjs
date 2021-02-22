import { App, ServerOptions } from "../src"
import { HttpContext } from '../src/context'

const app = new App()

app.use(async function(ctx: HttpContext, next){
    ctx.response.send("HELLO WORLD")
    await next()
})

app.start({
    port: 8080
})