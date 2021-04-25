import { generateRandomMonthCheckPoint } from '../../tests/helper/monthCheckpoint';
import { generateRandomTransaction } from '../../tests/helper/transaction';
import { MonthCheckpoint, Transaction } from '../@types';
import { TransactionsService } from './';

describe('transactions service', () => {
    it.each([
        [
            'one-sized-arrays',
            {
                transactions: [generateRandomTransaction({ amount: -10 })],
                monthCheckPoints: [
                    generateRandomMonthCheckPoint({ balance: -10 }),
                ],
            },
        ],
        [
            'multiple transactions',
            {
                transactions: [
                    generateRandomTransaction({ amount: 10 }),
                    generateRandomTransaction({ amount: -5 }),
                    generateRandomTransaction({ amount: -10 }),
                ],
                monthCheckPoints: [
                    generateRandomMonthCheckPoint({ balance: -5 }),
                ],
            },
        ],
    ])(
        'should answer with a correct message when valid - %s',
        (
            description,
            {
                transactions,
                monthCheckPoints,
            }: {
                transactions: Transaction[];
                monthCheckPoints: MonthCheckpoint[];
            }
        ) => {
            expect(
                TransactionsService.validate(transactions, monthCheckPoints)
            ).toBe('Accepted');
        }
    );

    it('should reject when amount & balance does not match with 1-sized-arrays', () => {
        expect(
            TransactionsService.validate(
                [generateRandomTransaction({ amount: 10 })],
                [generateRandomMonthCheckPoint({ balance: -100 })]
            )
        ).toBe('Refused');
    });
});
