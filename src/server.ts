import { injectable } from 'tsyringe'
import { fastify } from 'fastify'

@injectable()
export default class Server {
    public instance = fastify()

    public serve(port: number) {
        this.instance.listen(port)
    }
}