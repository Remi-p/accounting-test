import { MonthCheckpoint, Transaction } from '../@types';
import { InvalidBalanceError } from '../errors';

export class TransactionsService {
    public static validate = (
        transactions: Transaction[],
        monthCheckpoints: MonthCheckpoint[]
    ): string => {
        const totalTransactionsAmount = transactions.reduce(
            (acc, transaction) => acc + transaction.amount,
            0
        );
        if (totalTransactionsAmount === monthCheckpoints[0].balance) {
            return 'Accepted';
        }
        return 'Refused';
    };
}
