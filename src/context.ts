'use strict'

import { Request, RequestConfigContract } from '@poppinss/request'
import { Response, ResponseConfigContract } from '@poppinss/response'
import { IncomingMessage, ServerResponse } from 'http'

export interface HttpContext {
    request: Request
    response: Response
}

export class HttpContextContract {

    private static readonly req_config: RequestConfigContract = {
        allowMethodSpoofing: false,
        subdomainOffset: 2,
        trustProxy: require('proxy-addr').compile('loopback'),
        generateRequestId: true
    }

    private static readonly res_config: ResponseConfigContract = {
        etag: false,
        jsonpCallbackName: 'callback',
        secret: 'blah',
        cookie: {}
    }

    public static generate(request: IncomingMessage, response: ServerResponse): HttpContext {
        const req: Request = new Request(request, response, this.req_config)
        const res: Response = new Response(request, response, this.res_config)
        let ctx: HttpContext = {
            request: req,
            response: res
        }
        return ctx
    }
}