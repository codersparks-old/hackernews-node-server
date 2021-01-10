import { verify } from "jsonwebtoken";
import { Request } from "express";

export const APP_SECRET: string = 'GraphQL-is-aw3some';

const getTokenPayload:string | object = (token:string) => verify(token, APP_SECRET);

export const getUserId = (req?: Request, authToken?: String) => {

    if(req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }

            // @ts-ignore
            const {userId}  = getTokenPayload(token);

            return userId;
        } else if (authToken) {
            // @ts-ignore
            const { userId } = getTokenPayload(authToken);
            return userId;
        }

        throw new Error('Not authenticated');
    }
}



