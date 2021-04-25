import express from 'express';
import { InvalidInputError } from './errors/InvalidInput';
import { TransactionsService } from './services/transactions';

const PORT = 8080;

export const app = express();
app.use(express.json());

app.post('/movements/validation', function (req, res) {
    if (!req.body.movements || !req.body.balances) {
        throw new InvalidInputError();
    }
    const validationResult = TransactionsService.validate(
        req.body.movements,
        req.body.balances
    );

    res.send({
        message: validationResult.accepted ? 'Accepted' : 'Refused',
        reasons: validationResult.reasons,
    });
});

app.listen(PORT);

console.log(`server running on port ${PORT}`);
