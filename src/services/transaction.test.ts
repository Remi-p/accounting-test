import {
    startOfNextMonth,
    startOfThisMonth,
} from '../../tests/helper/dateHelper';
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
                    { balance: 100, date: startOfThisMonth },
                    { balance: 90, date: startOfNextMonth },
                ],
            },
        ],
        [
            'no transaction',
            {
                transactions: [],
                monthCheckPoints: [
                    {
                        balance: 0,
                        date: startOfNextMonth,
                    },
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
                    { balance: 10, date: startOfThisMonth },
                    { balance: 5, date: startOfNextMonth },
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
                    { balance: 10, date: startOfThisMonth },
                    { balance: 5, date: startOfNextMonth },
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
                    { balance: 0, date: new Date('2019-01-01') },
                    { balance: 5, date: new Date('2019-02-01') },
                    { balance: 0, date: new Date('2020-02-01') },
                    { balance: -10, date: new Date('2020-03-01') },
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
                [
                    { balance: 1000, date: startOfThisMonth },
                    { balance: 900, date: startOfNextMonth },
                ]
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
