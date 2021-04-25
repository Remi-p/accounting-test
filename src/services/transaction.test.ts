import { generateRandomMonthCheckPoint } from '../../tests/helper/monthCheckpoint';
import { generateRandomTransaction } from '../../tests/helper/transaction';
import { TransactionsService } from './';

describe('transactions service', () => {
    it('should answer with a correct message for 1-size arrays', () => {
        expect(
            TransactionsService.validate(
                [generateRandomTransaction({ amount: 10 })],
                [generateRandomMonthCheckPoint({ balance: -10 })]
            )
        ).toBe('Accepted');
    });

    it('should throw an error when amount & balance does not match', () => {
        expect(() =>
            TransactionsService.validate(
                [generateRandomTransaction({ amount: 10 })],
                [generateRandomMonthCheckPoint({ balance: -100 })]
            )
        ).toThrowError();
    });
});
