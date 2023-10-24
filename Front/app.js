const express = require('express')
const index=require('./route/index')
const session = require('express-session');

const app = express()
const port = 3000
app.set('view engine','pug')

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use('/',index);

app.listen(port, () => console.log(`Front app listening on port ${port}!`))