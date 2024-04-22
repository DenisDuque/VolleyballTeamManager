import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { NextFunction, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

export const DEFAULT_RESULTS_KEY = 'results';

export interface IResponseStream {
    fileName?: string;
    contentType?: string;
    stream: Readable;
}

export function sendResponse(method = 'send', resultsKey: string = DEFAULT_RESULTS_KEY, status?: number) {
    return (req: Request, res: Response) => {
        let finalStatus = res.statusCode;
        if (res.locals.__isStatusLocked__) {
            finalStatus = !status && !req[resultsKey as keyof typeof req] ? HttpStatus.StatusCodes.NO_CONTENT : status || HttpStatus.OK;
        }

        if (method === 'json') {
            res.status(finalStatus).json(req[resultsKey as keyof typeof req] || res.locals[resultsKey]);
        } else {
            res.status(finalStatus).send(req[resultsKey as keyof typeof req] || res.locals[resultsKey]);
        }
    }
}



export function sendJsonResponse(resultsKey: string = DEFAULT_RESULTS_KEY, status?: number) {
    return sendResponse('json', resultsKey, status);
}