import * as request from 'supertest';
import {app} from '../index';
import {gql} from 'mercurius-codegen';

describe(`Integration`, () => {
    // Just some small helper to wrap GraphQL success responses in the 'data' property
    const successResponse = (response: object): { data: object } => ({data: response});

    beforeEach(async () => {
        // Wait for our server to become ready to respond to requests
        await app.ready();
    });

    /**
     * GraphQL Query: add(...)
     */
    describe(`Query add(...)`, () => {
        it(`Should return correct response`, async () => {
            const query = gql`
                query {
                    add (x:5, y: 4)
                }
            `;
            const expectedResponse = successResponse({add: 9});

            await request(app.server)
                .post('/graphql')
                .send({
                    query,
                })
                .expect(200, expectedResponse);
        });
    });

    /**
     * GraphQL Query: sub(...)
     */
    describe(`Query sub(...)`, () => {
        it(`Should return correct response`, async () => {
            const query = gql`
                query {
                    sub (x:5, y: 4)
                }
            `;
            const expectedResponse = successResponse({sub: 1});

            await request(app.server)
                .post('/graphql')
                .send({
                    query,
                })
                .expect(200, expectedResponse);
        });
    });
});
