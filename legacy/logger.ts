import { env } from 'process'
import { logger as dev_logs } from '@poppinss/cliui'
import Pino from 'pino'

//Some compatibility patching
let pino = Pino()
pino.success = pino.info
pino.warning = pino.warn
pino.log = pino.info
pino.logError = pino.error
pino.logUpdate = pino.info
pino.action = (name: string) => {
    pino.info("Create action " + name)
    return {
        succeeded: pino.info,
        skipped: pino.info,
        failed: pino.warn
    }
}
export const logger = env.NODE_ENV === "production" ? pino : dev_logs