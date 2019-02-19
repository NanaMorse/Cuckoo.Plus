const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')

const httpApp = express()
const httpsApp = express()

const httpPort = 80
const httpsPort = 443

httpApp.all("*", (req, res) => {
  let host = req.headers.host
  host = host.replace(/:\d+$/, '')
  res.redirect(301, `https://${host}${req.path}`)
})

http.createServer(httpApp).listen(httpPort)

httpsApp.use(express.static('public'))
https.createServer({
  key: fs.readFileSync('../ssl/private.key'),
  cert: fs.readFileSync('../ssl/certificate.pem')
}, httpsApp).listen(httpsPort)
