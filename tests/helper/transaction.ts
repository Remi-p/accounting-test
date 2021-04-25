import { Transaction } from '../../src/@types';
import { randomInt } from './randomIntGenerator';

export const generateRandomTransaction = (
    partial: Partial<Transaction>
): Transaction => {
    const generatedTransaction: Transaction = {
        id: randomInt(1, 100),
        date: new Date(),
        wording: randomInt(1, 100).toString(),
        amount: randomInt(-500, 500),
    };
    return {
        ...generatedTransaction,
        ...partial,
    };
};
