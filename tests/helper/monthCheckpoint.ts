import { MonthCheckpoint } from '../../src/@types';
import { randomInt } from './randomIntGenerator';

export const generateRandomMonthCheckPoint = (
    partial: Partial<MonthCheckpoint> = {}
): MonthCheckpoint => {
    const generatedMonthCheckPoint: MonthCheckpoint = {
        date: new Date(),
        balance: randomInt(-500, 500),
    };
    return {
        ...generatedMonthCheckPoint,
        ...partial,
    };
};
