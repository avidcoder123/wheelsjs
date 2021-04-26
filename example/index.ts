import { bootstrap } from '../src'
import StartupClass from '../contracts/startup'

class Start implements StartupClass {
    public port = 8080
}

bootstrap(Start)