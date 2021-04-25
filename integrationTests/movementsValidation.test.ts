import request from 'supertest';

import { app } from '../src/server';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [
                    {
                        amount: 10,
                        id: 1,
                        date: new Date(),
                        wording: 'Buying coffee',
                    },
                ],
                balances: [{ date: new Date(), balance: -10 }],
            })
            .expect(200);
    });

    it('should reject an incorrect balance', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [
                    {
                        amount: 10,
                        id: 1,
                        date: new Date(),
                        wording: 'Buying coffee',
                    },
                ],
                balances: [{ date: new Date(), balance: -100 }],
            })
            .expect(422);
    });
});
