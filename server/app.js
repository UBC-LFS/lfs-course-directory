const express = require('express')
const { getCoursesInDept } = require('./getCourses')

const app = express()

app.get('/', (req, res) => {
  getCoursesInDept('APBI', 'W')
})

module.exports = app
