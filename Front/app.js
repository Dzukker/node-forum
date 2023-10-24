const express = require('express')
const index=require('./route/index')

const app = express()
const port = 3000
app.set('view engine','pug')


app.use('/',index);

app.listen(port, () => console.log(`Front app listening on port ${port}!`))