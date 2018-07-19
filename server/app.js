const express = require('express')
const getCoursesInTerm = require('./getCoursesInTerm')
const { getYear } = require('./util/get')
const path = require('path')
const fs = require('fs-extra')
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/:term', async ({ params }, res) => {
  const term = params.term
  const year = getYear()
  const pathToFile = path.join(__dirname, `courseFiles/${year}${term}.JSON`)
  const exists = await fs.pathExists(pathToFile)
  if (exists) {
    const json = await fs.readJson(pathToFile)
    res.send(json)
  } else {
    const courses = await getCoursesInTerm(year, term)
    await fs.writeJson(pathToFile, courses)
  }
})

module.exports = app
