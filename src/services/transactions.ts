import { MonthCheckpoint, Transaction } from '../@types';
import { InvalidInputError } from '../errors';

type OrganizedTransactions = {
    [key: string]: {
        computedBalance: number;
        transactions: Transaction[];
    };
};

export class TransactionsService {
    public static validate(
        transactions: Transaction[],
        monthCheckpoints: MonthCheckpoint[]
    ): { accepted: boolean; reasons: string[] } {
        const organizedTransactions = this.organizeTransactionsByMonth(
            transactions
        );
        let accepted = true;
        const reasons: string[] = [];

        monthCheckpoints.forEach((monthCheckpoint) => {
            if (!this.isFirstOfMonth(monthCheckpoint.date)) {
                throw new InvalidInputError(
                    `${monthCheckpoint.date} from checkpoints is not a first of month date`
                );
            }
            if (
                !this.isTransactionsConsistentWithCheckpoint(
                    organizedTransactions,
                    monthCheckpoint
                )
            ) {
                const month = this.getPreviousMonthFromDate(
                    monthCheckpoint.date
                );
                const computedBalance =
                    organizedTransactions[month]?.computedBalance || 0;
                accepted = false;
                reasons.push(
                    `${month}: computedValue ${computedBalance} mismatch balance ${monthCheckpoint.balance}`
                );
            }
        });

        return {
            accepted,
            reasons,
        };
    }

    private static organizeTransactionsByMonth(
        transactions: Transaction[]
    ): OrganizedTransactions {
        const organizedTransactions: OrganizedTransactions = {};

        transactions.forEach((transaction) => {
            const month = this.getMonthFromDate(transaction.date);
            if (!organizedTransactions[month]) {
                organizedTransactions[month] = {
                    computedBalance: 0,
                    transactions: [],
                };
            }
            organizedTransactions[month].computedBalance += transaction.amount;
            organizedTransactions[month].transactions.push(transaction);
        });

        return organizedTransactions;
    }

    private static isTransactionsConsistentWithCheckpoint(
        organizedTransactions: OrganizedTransactions,
        checkpoint: MonthCheckpoint
    ): boolean {
        const month = this.getPreviousMonthFromDate(checkpoint.date);

        if (!organizedTransactions[month] && checkpoint.balance === 0) {
            return true;
        }
        if (
            organizedTransactions[month] &&
            checkpoint.balance === organizedTransactions[month].computedBalance
        ) {
            return true;
        }
        return false;
    }

    private static isFirstOfMonth(inputDate: Date) {
        const date = new Date(inputDate);
        return date.getDate() === 1;
    }

    private static getMonthFromDate(inputDate: Date) {
        const date = new Date(inputDate);
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    private static getPreviousMonthFromDate(inputDate: Date) {
        const date = new Date(inputDate);
        const previousMonthDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth() - 1, 1)
        );
        return `${previousMonthDate.getFullYear()}-${
            previousMonthDate.getMonth() + 1
        }`;
    }
}
