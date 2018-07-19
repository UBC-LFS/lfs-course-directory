const express = require('express')
const { getCoursesInDept } = require('./getCourses')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  getCoursesInDept('APBI', 'W').then(x => res.send(x))
})

module.exports = app
