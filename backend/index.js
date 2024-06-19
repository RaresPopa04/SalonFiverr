const app = require('express')();
const connectDb = require('./includes/connectDb');

connectDb();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});