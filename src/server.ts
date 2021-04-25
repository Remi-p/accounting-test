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
    res.send(
        TransactionsService.validate(req.body.movements, req.body.balances)
    );
});

app.listen(PORT);

console.log(`server running on port ${PORT}`);
