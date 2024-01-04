import {EAvailableResolutions, ErrorsMessageType, ErrorType, VideoType} from "./settings";

export function isValidISODate(dateString: string): boolean {
    if (typeof dateString !== 'string') {
        return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString();
}

export type PayloadType = {
    body: Partial<VideoType>
};

export type ValidationType = (payload: PayloadType) => { errors: ErrorsMessageType, tempVideo: Partial<VideoType> };


export function validation(payload: PayloadType): { errorsMessages: ErrorType[]; tempVideo: Partial<VideoType> } {
    let {
        title,
        author,
        availableResolutions,
        minAgeRestriction,
        canBeDownloaded,
        publicationDate
    } = payload.body;

    let tempVideo: Partial<VideoType> = {};

    const errors: ErrorsMessageType = [] as ErrorsMessageType;

    if (!title || typeof title !== 'string' || title.trim().length > 40) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        });
    }
    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        errors.push({
            message: "Incorrect author",
            field: "author"
        });
    }
    if (availableResolutions && Array.isArray(availableResolutions) && availableResolutions.length > 0) {
        availableResolutions?.forEach(resolution => {
            if (!Object.values(EAvailableResolutions).includes(resolution)) {
                errors.push({
                    message: `Incorrect resolution: ${resolution}`,
                    field: "availableResolutions"
                });
                return;
            }
        })
    } else {
        tempVideo.availableResolutions = [];
    }

    if (minAgeRestriction && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({
            message: "Incorrect min age restriction",
            field: "minAgeRestriction"
        });
    }
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        errors.push({
            message: "Incorrect can be downloaded",
            field: "canBeDownloaded"
        });
    }

    if (publicationDate && (!isValidISODate(publicationDate))) {
        errors.push({
            message: "Incorrect publication date",
            field: "publicationDate"
        });
    }

    return ({errorsMessages: errors, tempVideo});
}
