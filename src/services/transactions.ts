import { MonthCheckpoint, Transaction } from '../@types';
import { InvalidBalanceError } from '../errors';

export class TransactionsService {
    public static validate = (
        transactions: Transaction[],
        monthCheckpoints: MonthCheckpoint[]
    ): string => {
        if (-transactions[0].amount === monthCheckpoints[0].balance) {
            return 'Accepted';
        }
        throw new InvalidBalanceError('An error was found');
    };
}
