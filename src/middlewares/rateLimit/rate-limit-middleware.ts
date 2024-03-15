import {NextFunction, Request, Response} from "express";
import {RateLimitRepository} from "../../repositories/rateLimit-repository";

export const rateLimitMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const count = await RateLimitRepository.count(request.ip!, request.url!);
    if (count !== null && count > 5) {
        return response.sendStatus(429);
    }
    await RateLimitRepository.createRateLimit({ip: request.ip!, url: request.url, date: new Date().toISOString()});
    return next();
}
