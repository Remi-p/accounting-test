import express from 'express';

const PORT = 8080;

export const app = express();

app.get('/:size', function (req, res) {
    res.send();
});

app.listen(PORT);

console.log(`server running on port ${PORT}`);
