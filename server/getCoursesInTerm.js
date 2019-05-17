/* global fetch */

require('isomorphic-fetch')
const { LFSDepts, buildURL } = require('./util/constants')
const XLJS = require('x2js')

const xljs = new XLJS()

const getCoursesInDept = async (year, dept, term) => {
  const json = await fetch(buildURL(year, term, dept))
    .then(res => res.text())
    .then(x => xljs.xml2js(x))
  if (json.error) return []
  const courses = Array.isArray(json.courses.course) ? json.courses.course : [json.courses.course]
  return courses.map(({ _key, _title }) => ({ course: _key, description: _title, dept }))
}

const getCoursesInTerm = async (year, term) =>
  Promise.all(
    LFSDepts.map(dept => getCoursesInDept(year, dept, term))
  )

module.exports = getCoursesInTerm
