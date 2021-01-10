export const link = (parent:any, args:any, context:any) => {
    return context.prisma.vote.findUnique({ where: { id: parent.id }}).link();
}

export const user = (parent:any, args:any, context:any) => {
    return context.prisma.vote.findUnique({where: {id: parent.id }}).user();
}