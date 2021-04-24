import express from 'express';

import { diamondMaker } from './services/diamondMaker';

const PORT = 8080;

export const app = express();

app.get('/:size', function (req, res) {
    res.send(diamondMaker(+req.params.size));
});

app.listen(PORT);

console.log(`server running on port ${PORT}`);
