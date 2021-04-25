import request from 'supertest';

import { app } from '../src/server';
import { generateRandomMonthCheckPoint } from '../tests/helper/monthCheckpoint';
import { generateRandomTransaction } from '../tests/helper/transaction';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction({ amount: 10 })],
                balances: [generateRandomMonthCheckPoint({ balance: -10 })],
            })
            .expect(200);
    });

    it('should reject an incorrect balance', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction({ amount: 10 })],
                balances: [generateRandomMonthCheckPoint({ balance: -100 })],
            })
            .expect(422);
    });
});
