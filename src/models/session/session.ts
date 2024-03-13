/* ip*	string
IP address of device during signing in

title*	string
Device name: for example Chrome 105 (received by parsing http header "user-agent")

lastActiveDate*	string
Date of the last generating of refresh/access tokens

deviceId*	string
Id of connected device session
*/

export type SessionDBModel = {
    ip: string
    title: string
    userId: string
    lastActiveDate: string
    expirationDate: string
    deviceId: string
}

// export type UpdateSearchParams = { deviceId: string, title: string }
export type SecurityRepository = SessionDBModel[]
