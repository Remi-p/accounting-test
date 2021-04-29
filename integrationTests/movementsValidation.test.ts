import request from 'supertest';

import { app } from '../src/server';
import { startOfNextMonth, startOfThisMonth } from '../tests/helper/dateHelper';
import { generateRandomMonthCheckPoint } from '../tests/helper/monthCheckpoint';
import { generateRandomTransaction } from '../tests/helper/transaction';

describe('Server', () => {
    it('should anwser something', () => {
        return request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction({ amount: -10 })],
                balances: [
                    { balance: 100, date: startOfThisMonth },
                    { balance: 90, date: startOfNextMonth },
                ],
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
                balances: [
                    { balance: 1000, date: startOfThisMonth },
                    { balance: 900, date: startOfNextMonth },
                ],
            })
            .expect(200)
            .then((response) => {
                const today = new Date();
                expect(response.body.message).toBe('Refused');
                expect(response.body.reasons).toEqual([
                    `${today.getFullYear()}-${
                        today.getMonth() + 1
                    }: computedValue 10 mismatch balance -100`,
                ]);
            });
    });

    it('should reject an incorrectly formed request', async () => {
        await request(app)
            .post('/movements/validation')
            .send({
                balances: [generateRandomMonthCheckPoint()],
            })
            .expect(422);

        await request(app)
            .post('/movements/validation')
            .send({
                movements: [generateRandomTransaction()],
            })
            .expect(422);
    });

    it('should reject a checkpoint with a date being not the first of a month', async () => {
        await request(app)
            .post('/movements/validation')
            .send({
                balances: [
                    generateRandomMonthCheckPoint({
                        date: new Date('2021-01-15'),
                    }),
                ],
                movements: [generateRandomTransaction()],
            })
            .expect(422);
    });
});
