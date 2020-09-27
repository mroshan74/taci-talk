const express = require('express')
const app = express()
const port = process.env.PORT || 9000
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const routes = require('./config/routes')
app.use('/api',routes)

const db = require('./config/database')
db()

app.listen(port, () => {
    console.log('OPENED PORT at --> ',port)
})