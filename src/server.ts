import express from 'express';
import { ApolloServer, PubSub } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer} from "http";
import compression from "compression";
import cors from 'cors';
import { schemaWithResolvers as schema } from './schema';
import { PrismaClient } from '@prisma/client';
import { getUserId } from "./utils";

const prisma = new PrismaClient();
const app = express();
const pubsub = new PubSub();
const server = new ApolloServer({
    schema,
    context: ({req, connection}) => {
        if(connection) {
            let context = {
                ...connection.context,
                ...req,
                prisma,
                pubsub,
                userId: req && req.headers.authorization ? getUserId(req) : null

            }
            return context;
        }
        return {
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null
        }
    },
    validationRules: [depthLimit(7)],
});

app.use('*', cors());
app.use(compression());
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(
    {port: 4000},
    (): void => {
        console.log('\n       GraphQL is now running on http://localhost:4000/graphql')
    }
);