import {newLinkEvent, newVoteEvent} from "../utils";

const newLinkSubscribe = (parent:any, args:any, context:any, info:any) => {
    return context.pubsub.asyncIterator(newLinkEvent);
}

export const newLink = {
    subscribe: newLinkSubscribe,
    resolve: (payload: any) => {
        return payload;
    }
}

const newVoteSubscribe = (parent:any, args:any, context:any, info:any) => {
    return context.pubsub.asyncIterator(newVoteEvent);
}

export const newVote = {
    subscribe: newVoteSubscribe,
    resolve: (payload:any) => {
        return payload;
    }
}