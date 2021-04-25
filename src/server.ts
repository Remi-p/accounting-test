import express from 'express';
import { TransactionsService } from './services/transactions';

const PORT = 8080;

export const app = express();
app.use(express.json());

app.post('/movements/validation', function (req, res) {
    res.send(
        TransactionsService.validate(req.body.movements, req.body.balances)
    );
});

app.listen(PORT);

console.log(`server running on port ${PORT}`);
