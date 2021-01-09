import { IResolvers } from '@graphql-tools/utils';


const resolvers: IResolvers = {
    Query: {
        info: (): string => `This is the API of a Hackernews Clone`,
        feed: async (_, __, context) => getAllLinks(_, __, context)
    },
    Mutation: {
        post: async (_, args, context) => addLink(_, args, context),
        updateLink: async (_, args, context) => updateLink(_, args, context),
        deleteLink: async (_, args, context) => deleteLink(_, args, context)
    }
};

const getAllLinks = (_:any, args:any, context:any ) => context.prisma.link.findMany();

const addLink = (_:any, args:any, context:any) => {
    const newLink = context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
        },
    })
    return newLink;
}

const updateLink = async (_:any, args:any, context:any) => {

    let link = await context.prisma.link.findUnique({ where: { id: +args.id }});

    let update = {
        description: args.description !== undefined ? args.description : link.description,
        url: args.url !== undefined ? args.url : link.url
    }

    return context.prisma.link.update({data: update, where: {id: link.id}});
}

const deleteLink = async (_:any, args:any, context:any) => {
    const link = await context.prisma.link.delete({where: { id: +args.id}});

    return link;

}
export default resolvers;