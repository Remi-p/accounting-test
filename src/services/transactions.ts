import { MonthCheckpoint, Transaction } from '../@types';
import { InvalidInputError } from '../errors';

type OrganizedTransactions = {
    [key: string]: {
        computedBalance: number;
        transactions: Transaction[];
    };
};

type OrganizedCheckpointsMonth = {
    monthDifference?: number;
    startOfMonthCheckpoint?: MonthCheckpoint;
    endOfMonthCheckpoint?: MonthCheckpoint;
};
type OrganizedCheckpoints = {
    [key: string]: OrganizedCheckpointsMonth;
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
                !this.isTransactionsConsistentWithBalance(
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

            organizedTransactions[
                month
            ] = this.completeOrganizedTransactionsMonth(
                organizedTransactions,
                month,
                transaction
            );
        });

        return organizedTransactions;
    }

    private static completeOrganizedTransactionsMonth(
        organizedTransactions: OrganizedTransactions,
        month: string,
        transaction: Transaction
    ) {
        if (!organizedTransactions[month]) {
            organizedTransactions[month] = {
                computedBalance: 0,
                transactions: [],
            };
        }
        organizedTransactions[month].computedBalance += transaction.amount;
        organizedTransactions[month].transactions.push(transaction);
        return organizedTransactions[month];
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

            const {
                nextMonth: nextOrganizedMonth,
                currentMonth: currentOrganizedMonth,
            } = this.completeOrganizedCheckpointsMonth(
                organizedCheckpoints,
                currentMonth,
                nextMonth,
                checkpoint
            );

            organizedCheckpoints[nextMonth] = nextOrganizedMonth;
            organizedCheckpoints[currentMonth] = currentOrganizedMonth;
        });

        Object.keys(organizedCheckpoints).forEach((month) => {
            const organizedCheckpointsMonth = organizedCheckpoints[month];

            if (
                this.isOrganizedCheckpointsMonthComplete(
                    organizedCheckpointsMonth
                )
            ) {
                organizedCheckpointsMonth.monthDifference =
                    organizedCheckpointsMonth.endOfMonthCheckpoint!.balance -
                    organizedCheckpointsMonth.startOfMonthCheckpoint!.balance;
            } else {
                delete organizedCheckpoints[month];
            }
        });

        return organizedCheckpoints;
    }

    private static completeOrganizedCheckpointsMonth(
        organizedCheckpoints: OrganizedCheckpoints,
        currentMonth: string,
        nextMonth: string,
        checkpoint: MonthCheckpoint
    ) {
        const nextOrganizedMonth: OrganizedCheckpointsMonth =
            organizedCheckpoints[nextMonth] || {};
        const currentOrganizedMonth: OrganizedCheckpointsMonth =
            organizedCheckpoints[currentMonth] || {};

        nextOrganizedMonth.startOfMonthCheckpoint = checkpoint;
        currentOrganizedMonth.endOfMonthCheckpoint = checkpoint;

        return {
            nextMonth: nextOrganizedMonth,
            currentMonth: currentOrganizedMonth,
        };
    }

    private static isOrganizedCheckpointsMonthComplete(
        organizedCheckpoints: OrganizedCheckpointsMonth
    ) {
        return (
            organizedCheckpoints.endOfMonthCheckpoint &&
            organizedCheckpoints.startOfMonthCheckpoint
        );
    }

    private static isTransactionsConsistentWithBalance(
        organizedTransactions: OrganizedTransactions,
        month: string,
        balance: number
    ): boolean {
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
