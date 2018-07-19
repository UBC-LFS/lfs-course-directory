const baseURL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`
const setYear = year => `sessyr=${year}`
const setTerm = term => `sesscd=${term}`
const setDept = deptCode => `dept=${deptCode}`
// const setCourse = courseCode => `course=${courseCode}`
const LFSDepts = ['APBI', 'FNH', 'FOOD', 'FRE', 'GRS', 'HUNU', 'LFS', 'LWS', 'PLNT', 'SOIL']
const buildURL = (year, term, dept) => {
  const Year = setYear(year)
  const Term = setTerm(term)
  const Dept = setDept(dept)
  return `${baseURL}&${Year}&${Term}&req=2&${Dept}&output=3`
}
export {
  buildURL,
  LFSDepts
}
