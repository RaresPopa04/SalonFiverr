const app = require('express')();
const connectDb = require('./includes/connectDb');
const Appointment = require('./controllers/Appointment');
const User = require('./controllers/User');
const Comment = require('./controllers/Comments');
connectDb();

app.use(require('express').json());
app.use('/appointment', Appointment);
app.use('/user', User);
app.use('/comment', Comment);  

app.listen(5000, () => {
    console.log('Server running on port 5000');
});