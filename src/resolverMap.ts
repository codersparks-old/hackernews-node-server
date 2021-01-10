import { IResolvers } from '@graphql-tools/utils';

import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as User from './resolvers/User';
import * as Link from './resolvers/Link';


const resolvers: IResolvers = {
    Query,
    Mutation,
    User,
    Link
};



export default resolvers;