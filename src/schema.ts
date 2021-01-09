import { loadSchemaSync} from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { join } from "path";
import resolvers from "./resolverMap";

const schema = loadSchemaSync(join(__dirname, './schema/schema.graphql'), { loaders: [new GraphQLFileLoader()]});

export const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers
})

