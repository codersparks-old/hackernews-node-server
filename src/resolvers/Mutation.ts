import {compare, hash} from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {APP_SECRET, getUserId, newLinkEvent, newVoteEvent} from "../utils";

export const signup = async (parent:any, args:any, context:any, info:any) => {
    const password = await hash(args.password, 10);
    const user = await context.prisma.user.create({ data: { ...args, password }});
    const token = sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

export const login = async (parent:any, args:any, context:any, info:any ) => {

    const user = await context.prisma.user.findUnique({ where: { email: args.email }});

    if(!user) {
        throw new Error("No such user found");
    }

    const valid = await compare(args.password, user.password);

    if ( !valid ) {
        throw new Error('Invalid Password');
    }

    const token = sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    }

}

export const post = async (_:any, args:any, context:any) => {

    const { userId } = context;

    const newLink = await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId }}
        },
    });

    await context.pubsub.publish(newLinkEvent, newLink);

    return newLink;
}

export const updateLink = async (_:any, args:any, context:any) => {

    let link = await context.prisma.link.findUnique({ where: { id: +args.id }});

    let update = {
        description: args.description !== undefined ? args.description : link.description,
        url: args.url !== undefined ? args.url : link.url
    }

    return context.prisma.link.update({data: update, where: {id: link.id}});
}

export const deleteLink = async (_:any, args:any, context:any) => {
    const link = await context.prisma.link.delete({where: {id: +args.id}});

    return link;
}

export const vote = async (parent:any, args:any, context:any, info:any) => {
    const  {userId} = context;

    const vote = await context.prisma.vote.findUnique({
        where: {
            linkId_userId: {
                linkId: Number(args.linkId),
                userId: userId
            }
        }
    });

    if (Boolean(vote)) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = context.prisma.vote.create({
        data: {
            user: { connect: {id:userId}},
            link: { connect: {id: Number(args.linkId)}},
        }
    })

    context.pubsub.publish(newVoteEvent, newVote);

    return newVote;
}