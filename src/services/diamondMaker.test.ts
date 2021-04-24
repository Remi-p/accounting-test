import { diamondMaker } from './diamondMaker';

describe('diamondMaker', () => {
    it('should make a 3-sized diamond', () => {
        expect(diamondMaker(3)).toBe(' # \n' + '###\n' + ' # \n');
    });

    it('should make a 5-sized diamond', () => {
        expect(diamondMaker(5)).toBe(
            '  #  \n' + ' ### \n' + '#####\n' + ' ### \n' + '  #  \n'
        );
    });
});
