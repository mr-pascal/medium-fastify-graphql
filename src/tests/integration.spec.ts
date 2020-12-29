import * as request from 'supertest';
import {app} from '../index';

describe(`Routes`, () => {
    beforeEach(async () => {
        await app.ready();

        jest.clearAllMocks();
    });

    it(`Should test 'add' endpoint`, async ()=>{
        await request(app.server)
            .post('/graphql')
            .send({
                query: '{ add (x: 5, y: 4) }',
            })
            .expect(200, {data: {add: 9}});
    });
});
