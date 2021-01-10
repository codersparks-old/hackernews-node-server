import { IResolvers } from '@graphql-tools/utils';

import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as User from './resolvers/User';
import * as Link from './resolvers/Link';
import * as Subscription from './resolvers/Subscription';
import * as Vote from './resolvers/Vote';

const resolvers: IResolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
};



export default resolvers;