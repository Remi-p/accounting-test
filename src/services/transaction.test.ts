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
            'no transaction',
            {
                transactions: [],
                monthCheckPoints: [
                    generateRandomMonthCheckPoint({ balance: 0 }),
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
        [
            'multiple transactions with some not in the checked month',
            {
                transactions: [
                    generateRandomTransaction({ amount: 10 }),
                    generateRandomTransaction({ amount: -5 }),
                    generateRandomTransaction({ amount: -10 }),
                    generateRandomTransaction({
                        amount: -10,
                        date: new Date('2019-01-01'),
                    }),
                ],
                monthCheckPoints: [
                    generateRandomMonthCheckPoint({ balance: -5 }),
                ],
            },
        ],
        [
            'multiple transactions, multiple checked months',
            {
                transactions: [
                    generateRandomTransaction({
                        amount: 10,
                        date: new Date('2019-01-01'),
                    }),
                    generateRandomTransaction({
                        amount: -5,
                        date: new Date('2019-01-05'),
                    }),
                    generateRandomTransaction({
                        amount: -10,
                        date: new Date('2020-02-01'),
                    }),
                    generateRandomTransaction({
                        amount: -10,
                        date: new Date('2021-03-01'),
                    }),
                ],
                monthCheckPoints: [
                    { balance: 5, date: new Date('2019-01-31') },
                    { balance: -10, date: new Date('2020-02-29') },
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
            ).toMatchObject({ accepted: true });
        }
    );

    it('should reject when amount & balance does not match with 1-sized-arrays', () => {
        const today = new Date();

        expect(
            TransactionsService.validate(
                [generateRandomTransaction({ amount: 10 })],
                [generateRandomMonthCheckPoint({ balance: -100 })]
            )
        ).toEqual({
            accepted: false,
            reasons: [
                `${today.getFullYear()}-${
                    today.getMonth() + 1
                }: computedValue 10 mismatch balance -100`,
            ],
        });
    });
});
