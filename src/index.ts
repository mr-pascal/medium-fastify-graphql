import {makeExecutableSchema} from '@graphql-tools/schema';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';
import fastify, {FastifyInstance} from 'fastify';
import {Server, IncomingMessage, ServerResponse} from 'http';
import mercurius from 'mercurius';
import {gql} from 'mercurius-codegen';

/**
 * Create instance of our Fastify server
 * We need to export it here so we can easily use it in our automated tests
 */
export const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({logger: false});

/**
 * Type Definitions
 */
const typeDefs = gql`
    type Query {
        """ Method to add two integers """
        add(
            " First integer "
            x: Int,
            " Second integer "
            y: Int
        ): Int

    }
`;
const typeDefs2 = gql`
    type Query {
        """ Method to substract two integers """
        sub(
            " First integer "
            x: Int,
            " Second integer "
            y: Int
        ): Int
    }
`;
/** ********* **/

/**
 * Resolvers
 */
const resolvers = {
    Query: {
        /**
         * Simple resolver to add two numbers
         * @param {object} _
         * @param {number} x  First number
         * @param {number} y Second number
         */
        add: async (_: unknown, {x, y}: { x: number, y: number }): Promise<number> => x + y,
    },
};
const resolvers2 = {
    Query: {
        /**
         * Simple resolver to subtract two numbers
         * @param {object} _
         * @param {number} x  First number
         * @param {number} y Second number
         */
        sub: async (_: unknown, {x, y}: { x: number, y: number }): Promise<number> => x - y,
    },
};

/**
 * Add 'mercurius' to our fastify server
 */
app.register(mercurius, {
    schema: makeExecutableSchema({
        // Merge type definitions from different sources
        typeDefs: mergeTypeDefs([typeDefs, typeDefs2]),
        // Merge resolvers from different sources
        resolvers: mergeResolvers([resolvers, resolvers2]),
    }),
    // Enable the GraphQL Playground
    graphiql: 'playground',
});

const port = process.env.PORT || 8080;

// Start server
const start = async (): Promise<void> => {
    try {
        await app.listen(port, '0.0.0.0');
        console.log(`Listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

