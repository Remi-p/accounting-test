import { TransactionsService } from './transactions';

describe('transactions service', () => {
    it('should answer with a correct message for 1-size arrays', () => {
        expect(
            TransactionsService.validate(
                [
                    {
                        amount: 10,
                        id: 1,
                        date: new Date(),
                        wording: 'Buying coffee',
                    },
                ],
                [{ date: new Date(), balance: -10 }]
            )
        ).toBe('Accepted');
    });

    it('should throw an error when amount & balance does not match', () => {
        expect(() =>
            TransactionsService.validate(
                [
                    {
                        amount: 10,
                        id: 1,
                        date: new Date(),
                        wording: 'Buying coffee',
                    },
                ],
                [{ date: new Date(), balance: -100 }]
            )
        ).toThrowError();
    });
});
