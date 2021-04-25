import { MonthCheckpoint, Transaction } from '../@types';

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
            if (
                !this.isTransactionsConsistentWithCheckpoint(
                    organizedTransactions,
                    monthCheckpoint
                )
            ) {
                const month = this.getMonthFromDate(monthCheckpoint.date);
                accepted = false;
                reasons.push(
                    `${month}: computedValue ${organizedTransactions[month].computedBalance} mismatch balance ${monthCheckpoint.balance}`
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
        const month = this.getMonthFromDate(checkpoint.date);

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

    private static getMonthFromDate(inputDate: Date) {
        const date = new Date(inputDate);
        return `${date.getFullYear()}-${date.getMonth()}`;
    }
}
