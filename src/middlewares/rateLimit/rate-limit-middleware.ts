import {NextFunction, Request, Response} from "express";
import {RateLimitRepository} from "../../repositories/rateLimit-repository";

export const rateLimitMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const count = await RateLimitRepository.count(request.ip!, request.originalUrl!);
    if (count !== null && count >= 5) {
        return response.status(429).send("Too Many Requests");
    }
    await RateLimitRepository.createRateLimit({ip: request.ip!, url: request.originalUrl, date: new Date().getTime()});

    return next();
}
