/* global fetch */

require('isomorphic-fetch')
const express = require('express')
const getCoursesInTerm = require('./getCoursesInTerm')
const path = require('path')
const fs = require('fs-extra')
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/lfscourses/', express.static(path.join(__dirname, './public/build')))

app.get('/lfscourses/:year/:term', async ({ params: { year, term } }, res) => {
  const pathToFile = path.join(__dirname, `courseFiles/${year}${term}.JSON`)
  const fileExists = await fs.pathExists(pathToFile)
  if (fileExists) {
    const courses = await fs.readJson(pathToFile)
    res.send(courses)
  } else {
    try {
      const courses = await getCoursesInTerm(year, term)
      res.send(courses)
      fs.writeJson(pathToFile, courses)
    } catch (e) {
      res.status(404)
      res.send(`${year}${term} courses are currently not available. Please try in the future.`)
    }
  }
})

app.get('/lfscourses/availableSyllabi/', async (req, res) => {
  const availableSyllabi = await fetch('http://localhost:10082/availableSyllabi')
    .then(x => x.json())
  res.send(availableSyllabi)
})

module.exports = app
