import {SessionDBModel} from "../session";
import {WithId} from "mongodb";
import {SessionOutputType} from "../output";

export const mapper = (data: WithId<SessionDBModel>): SessionOutputType => {
    return {
        ip: data.ip,
        title: data.title,
        lastActiveDate: data.lastActiveDate,
        deviceId: data.deviceId
    }
}
