const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const app = express()

const httpPort = 80
const httpsPort = 443

app.use(express.static('public'))

const httpsOptions = {
  key: fs.readFileSync('../ssl/private.key'),
  cert: fs.readFileSync('../ssl/certificate.pem')
}

http.createServer(app).listen(httpPort)
https.createServer(httpsOptions, app).listen(httpsPort)
