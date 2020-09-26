const express = require('express')
const app = express()
const port = process.env.PORT || 9000
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('dev'))

const routes = require('./config/routes')
app.use('/api',routes)

const db = require('./config/database')
db()

app.listen(port, () => {
    console.log('OPENED PORT at --> ',port)
})