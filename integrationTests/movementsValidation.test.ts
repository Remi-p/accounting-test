import request from 'supertest';

import { app } from '../src/server';
import { generateRandomMonthCheckPoint } from '../tests/helper/monthCheckpoint';
import { generateRandomTransaction } from '../tests/helper/transaction';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction({ amount: -10 })],
                balances: [generateRandomMonthCheckPoint({ balance: -10 })],
            })
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe('Accepted');
            });
    });

    it('should reject an incorrect balance', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction({ amount: 10 })],
                balances: [generateRandomMonthCheckPoint({ balance: -100 })],
            })
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe('Refused');
                expect(response.body.reasons).toEqual([
                    '2021-3: computedValue 10 mismatch balance -100',
                ]);
            });
    });

    it('should reject an incorrectly formed request', async () => {
        await request(app)
            .post('/movements/validation')
            .send({
                balances: [generateRandomMonthCheckPoint()],
            })
            .expect(415);

        await request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction()],
            })
            .expect(415);
    });
});
