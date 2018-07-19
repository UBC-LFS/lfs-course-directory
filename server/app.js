const express = require('express')
const getCoursesInTerm = require('./getCoursesInTerm')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/W', (req, res) => {
  getCoursesInTerm('W').then(x => res.send(x))
})

app.get('/S', (req, res) => {
  getCoursesInTerm('S').then(x => res.send(x))
})

module.exports = app
