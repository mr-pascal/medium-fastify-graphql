import {makeExecutableSchema} from '@graphql-tools/schema';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';
import fastify, {FastifyInstance} from 'fastify';
import {Server, IncomingMessage, ServerResponse} from 'http';
import mercurius from 'mercurius';
import {gql} from 'mercurius-codegen';


export const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({logger: false});

const typeDefs = gql`
  type Query {
    add(x: Int, y: Int): Int

  }
`;
const typeDefs2 = gql`
    type Query {
        sub(x: Int, y: Int): Int        
    }
`;

const resolvers = {
    Query: {
        add: async (_: unknown, {x, y}: { x: number, y: number }): Promise<number> => x + y,
    },
};
const resolvers2 = {
    Query: {
        sub: async (_:unknown, {x, y}: { x: number, y: number }): Promise<number> => x - y,
    },
};

app.register(mercurius, {
    schema: makeExecutableSchema({typeDefs: mergeTypeDefs([typeDefs, typeDefs2]), resolvers: mergeResolvers([resolvers, resolvers2])}),
    graphiql: 'playground',
});

const port = process.env.PORT || 8080;
// Run the server!
const start = async (): Promise<void> => {
    try {
        // IMPORTANT: The Address '0.0.0.0' is super important to make it work with Cloud Run!!!!!
        await app.listen(port, '0.0.0.0');
        console.log(`Listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

