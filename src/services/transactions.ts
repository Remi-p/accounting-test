import { MonthCheckpoint, Transaction } from '../@types';
import { InvalidInputError } from '../errors';

type OrganizedTransactions = {
    [key: string]: {
        computedBalance: number;
        transactions: Transaction[];
    };
};

type OrganizedCheckpoints = {
    [key: string]: {
        monthDifference?: number;
        startOfMonthCheckpoint?: MonthCheckpoint;
        endOfMonthCheckpoint?: MonthCheckpoint;
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
        const organizedCheckpoints = this.organizeCheckpointsByMonth(
            monthCheckpoints
        );
        let accepted = true;
        const reasons: string[] = [];

        Object.keys(organizedCheckpoints).forEach((month) => {
            const balance = organizedCheckpoints[month]!.monthDifference!;
            if (
                !this.isTransactionsConsistentWithCheckpoint(
                    organizedTransactions,
                    month,
                    balance
                )
            ) {
                const computedBalance =
                    organizedTransactions[month]?.computedBalance || 0;
                accepted = false;
                reasons.push(
                    `${month}: computedValue ${computedBalance} mismatch balance ${balance}`
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

    private static organizeCheckpointsByMonth(
        checkpoints: MonthCheckpoint[]
    ): OrganizedCheckpoints {
        const organizedCheckpoints: OrganizedCheckpoints = {};

        checkpoints.forEach((checkpoint) => {
            if (!this.isFirstOfMonth(checkpoint.date)) {
                throw new InvalidInputError(
                    `${checkpoint.date} from checkpoints is not a first of month date`
                );
            }
            const nextMonth = this.getMonthFromDate(checkpoint.date);
            const currentMonth = this.getPreviousMonthFromDate(checkpoint.date);

            if (!organizedCheckpoints[nextMonth]) {
                organizedCheckpoints[nextMonth] = {};
            }
            organizedCheckpoints[nextMonth].startOfMonthCheckpoint = checkpoint;
            if (!organizedCheckpoints[currentMonth]) {
                organizedCheckpoints[currentMonth] = {};
            }
            organizedCheckpoints[
                currentMonth
            ].endOfMonthCheckpoint = checkpoint;
        });

        Object.keys(organizedCheckpoints).forEach((month) => {
            if (
                organizedCheckpoints[month].endOfMonthCheckpoint &&
                organizedCheckpoints[month].startOfMonthCheckpoint
            ) {
                organizedCheckpoints[month].monthDifference =
                    organizedCheckpoints[month].endOfMonthCheckpoint!.balance -
                    organizedCheckpoints[month].startOfMonthCheckpoint!.balance;
            } else {
                delete organizedCheckpoints[month];
            }
        });

        return organizedCheckpoints;
    }

    private static isTransactionsConsistentWithCheckpoint(
        organizedTransactions: OrganizedTransactions,
        month: string,
        balance: number
    ): boolean {
        console.log('month:', month);
        console.log(
            'organizedTransactions[month]:',
            organizedTransactions[month]
        );
        console.log('balance:', balance);
        if (!organizedTransactions[month] && balance === 0) {
            return true;
        }
        if (
            organizedTransactions[month] &&
            balance === organizedTransactions[month].computedBalance
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
