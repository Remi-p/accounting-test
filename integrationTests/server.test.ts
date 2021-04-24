import request from 'supertest';

import { app } from '../src/server';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app)
            .get('/5')
            .expect(200);
    });

    it('should construct a 3-sized diamond', () => {
        return request(app)
            .get('/3')
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(' # \n' + '###\n' + ' # \n');
            });
    });
});
