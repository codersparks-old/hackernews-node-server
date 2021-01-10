import express from 'express';
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer} from "http";
import compression from "compression";
import cors from 'cors';
import { schemaWithResolvers as schema } from './schema';
import { PrismaClient } from '@prisma/client';
import { getUserId } from "./utils";

const prisma = new PrismaClient();
const app = express();
const server = new ApolloServer({
    schema,
    context: ({req}) => {
        return {
            ...req,
            prisma,
            userId: req && req.headers.authorization ? getUserId(req) : null
        }
    },
    validationRules: [depthLimit(7)],
});

app.use('*', cors());
app.use(compression());
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);

httpServer.listen(
    {port: 3000},
    (): void => console.log('\n       GraphQL is now running on http://localhost:3000/graphql')
);