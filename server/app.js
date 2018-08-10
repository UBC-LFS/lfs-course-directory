const express = require('express')
const { getCoursesInTerm } = require('./util/get')
const path = require('path')
const fs = require('fs-extra')
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// this logic needs to be checked out, could be problematic...
app.get('/:year/:term', async ({ params: { year, term } }, res) => {
  const pathToFile = path.join(__dirname, `courseFiles/${year}${term}.JSON`)
  const fileExists = await fs.pathExists(pathToFile)
  if (fileExists) {
    const courses = await fs.readJson(pathToFile)
    res.send(courses)
  } else {
    const courses = await getCoursesInTerm(year, term)
    res.send(courses)
    fs.writeJson(pathToFile, courses)
  }
})

module.exports = app
