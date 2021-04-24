export const diamondMaker = (size: number): string => {
    const ceiledMiddle = Math.floor(size / 2);
    let diamond = '';
    for (let i = 0; i < ceiledMiddle; i++) {
        diamond += lineMaker(ceiledMiddle - i, i * 2);
    }
    for (let i = ceiledMiddle; i >= 0; i--) {
        diamond += lineMaker(ceiledMiddle - i, i * 2);
    }
    return diamond;
};

function lineMaker(blank: number, diamondCharacter: number) {
    return (
        ' '.repeat(blank) +
        '#' +
        '#'.repeat(diamondCharacter) +
        ' '.repeat(blank) +
        '\n'
    );
}
