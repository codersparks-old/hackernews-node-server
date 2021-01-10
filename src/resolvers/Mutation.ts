import {compare, hash} from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {APP_SECRET} from "../utils";

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

    return await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId }}
        },
    });
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
    const link = await context.prisma.link.delete({where: { id: +args.id}});

    return link;

}