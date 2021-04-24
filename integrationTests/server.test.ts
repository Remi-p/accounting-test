import request from 'supertest';

import { app } from '../src/server';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app).post('/movements/validation').expect(200);
    });
});
