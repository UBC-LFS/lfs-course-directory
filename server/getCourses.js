/* global fetch */

require('isomorphic-fetch')
const { getYear } = require('./util/get')
const { LFSDepts, buildURL } = require('./util/constants')
const XLJS = require('x2js')

const xljs = new XLJS()

const getCoursesInDept = async (dept, term) => {
  const year = getYear()
  const json = await fetch(buildURL(year, term, dept))
    .then(res => res.text())
    .then(x => xljs.xml2js(x))
  const courses = Array.isArray(json.courses.course) ? json.courses.course : [json.courses.course]
  return courses.map(({ _key, _title }) => ({ course: _key, description: _title }))
}

module.exports = {
  getCoursesInDept
}
