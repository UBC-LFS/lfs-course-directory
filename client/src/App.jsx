/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl, Table } from 'react-bootstrap'
import 'react-dropdown/style.css'
import './App.css'
import ToggleButton from 'react-toggle-button'
import Select from 'react-select'
import ResultsTable from './ResultsTable'
import { flatten } from 'ramda'

const options = [
  { value: '-', label: '-' },
  { value: 'APBI', label: 'APBI' },
  { value: 'FNH', label: 'FNH' },
  { value: 'FOOD', label: 'FOOD' },
  { value: 'FRE', label: 'FRE' },
  { value: 'GRS', label: 'GRS' },
  { value: 'HUNU', label: 'HUNU' },
  { value: 'LFS', label: 'LFS' },
  { value: 'LWS', label: 'LWS' },
  { value: 'PLNT', label: 'PLNT' },
  { value: 'SOIL', label: 'SOIL' },
]

const getYear = () => {
  const date = new Date()
  return date.getFullYear()
}

const getCurrentMonth = () => {
  const date = new Date()
  return date.getMonth()
}

const getDefaultYearTerm = () => {
  const yr = getYear()

  if (getCurrentMonth() <= 1) {
    const thisYr = yr - 1
    return thisYr
  }
  else {
    return yr
  }
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      availableTerms: [],
      selectedYearTerm: {},
      syllabi: false,
      filteredCourses: [],
      selectedDept: null,
      selectionDepts: [],
      searchBar: false,
      invalidYearTerm: false,
      availableSyllabi: []
    }
  }

  async componentDidMount() {
    const availableSyllabi = await this.getAvailableSyllabi()
      
    this.populateYearTerms()
      .then(({ year, term }) => this.getCoursesForTerm(year, term, availableSyllabi))
  }

  populateYearTerms = async () => {
    const year = getDefaultYearTerm()
    const prevYear = year - 1
    const nextYear = year + 1

    const yearAndTerms = [
      { value: { year: nextYear, term: 'W' }, label: nextYear + ' Winter' },
      { value: { year: nextYear, term: 'S' }, label: nextYear + ' Summer' },
      { value: { year, term: 'W' }, label: year + ' Winter' },
      { value: { year, term: 'S' }, label: year + ' Summer' },
      { value: { year: prevYear, term: 'W' }, label: prevYear + ' Winter' },
      { value: { year: prevYear, term: 'S' }, label: prevYear + ' Summer' }
    ]
    this.setState({
      availableTerms: yearAndTerms,
      selectedYearTerm: { year, term: 'W' }
    })
    return { year, term: 'W' }
  }

  getCoursesForTerm = async (year, term, availableSyllabi) => {
    const response = await fetch(`/lfscourses/${year}/${term}`)
    if (response.status === 404) {
      this.setState({
        invalidYearTerm: true
      })
    }
    else {
      const allCourses = flatten(await response.json())

      const deptSectionKey = allCourses.map(({ dept, course }) => dept + course)

      console.log(allCourses.length)
      availableSyllabi.forEach(({ term, courses }) => {
        courses.forEach(courseName => {
          // Handle newer term course codes
          let splitCourseName = courseName.split(' ')
          let originalCourseName = courseName
          if (splitCourseName.length > 1) {
            let dept = splitCourseName[0]
            let courseCode = splitCourseName[1]
            courseName = dept + courseCode
          }
          const index = deptSectionKey.findIndex(key => key === courseName)
          if (index !== -1) {
            allCourses[index].syllabus = {
              term,
              courseName,
              originalCourseName
            }
          }
        })
      })


      this.setState({
        invalidYearTerm: false,
        courses: allCourses,
        filteredCourses: allCourses
      })
    }
  }

  getAvailableSyllabi = async () => {
    const availableSyllabi = await fetch(`/lfscourses/availableSyllabi`)
      .then(x => x.json())
    this.setState({
      availableSyllabi
    })
    return availableSyllabi
  }

  handleYearTerm = async event => {
    await this.setState({
      selectedYearTerm: event.value
    })
    await this.getCoursesForTerm(this.state.selectedYearTerm.year, this.state.selectedYearTerm.term, this.state.availableSyllabi)
    this.handleChange()
  }

  handleToggleForSyllabi = async newvalue => {
    await this.setState({
      syllabi: newvalue
    })
    this.handleChange()
  }

  handleSyllabi = workingList => workingList
    .filter(({ syllabus }) => syllabus)
    .filter(courses => courses.length !== 0)

  handleSelectionEvent = async event => {
    if (event.value === '-') {
      await this.setState({
        selectedDept: null
      })
    } else {
      await this.setState({
        selectedDept: event.value
      })
    }
    this.handleChange()
  }

  handleSelection = workingList => workingList
    .filter(({ dept }) => dept === this.state.selectedDept)
    .filter(courses => courses.length !== 0)

  handleSearchUpdate = async () => {
    let text = this.searchbar.value.toUpperCase().split(/\s+/)

    if (text[0].length > 0) {
      await this.setState({
        searchBar: text
      })
    } else {
      await this.setState({
        searchBar: false
      })
    }

    this.handleChange()
  }

  handleSearchFilter = workingList => {
    let textArray = this.state.searchBar
    const firstWord = textArray[0]

    const moreThanTwoWords = textArray.length > 2
    const exactlyTwoWords = textArray[1]

    if (moreThanTwoWords) {
      return workingList
        .filter(course => textArray
          .every(word => course.description.toUpperCase().includes(word)))
        .filter(courses => courses.length !== 0)
    }

    else if (exactlyTwoWords) {
      const secondWord = exactlyTwoWords
      return workingList
        .filter(course => ((course.dept.includes(firstWord) || course.dept.includes(secondWord))
          && (course.course.includes(firstWord) || course.course.includes(secondWord)))
          || (course.description.toUpperCase().includes(firstWord) && course.description.toUpperCase().includes(secondWord)))
        .filter(courses => courses.length !== 0)
    }

    else {
      return workingList
        .filter(course => course.dept.includes(firstWord)
          || course.course.includes(firstWord)
          || course.description.toUpperCase().includes(firstWord))
        .filter(courses => courses.length !== 0)
    }
  }

  handleChange = () => {
    // check term
    let workingList = this.state.courses
    // check syllabi
    if (this.state.syllabi) {
      workingList = this.handleSyllabi(workingList)
    }
    // check selection
    if (this.state.selectedDept !== null) {
      workingList = this.handleSelection(workingList)
    }
    // check search bar
    if (this.state.searchBar) {
      workingList = this.handleSearchFilter(workingList)
    }

    // set filteredCourses: masterList
    this.setState({
      filteredCourses: workingList
    })
  }

  render() {
    return (
      <Grid>
        <Row className='show-grid'>
          <Col>
            <h2>LFS Course Directory</h2>
            <p>Please note the Session displays the courses offered in the selected Session, but the syllabus shows the most up-to-date syllabus, and is for reference purposes only. </p>
          </Col>
        </Row>
        <Row><br /></Row>
        <Table condensed hover>
          <thead>
            <tr>
              <th>Session <Select
                className='basic-single'
                classNamePrefix='select'
                defaultValue={this.state.availableTerms[4]}
                options={this.state.availableTerms}
                onChange={this.handleYearTerm}
              />
              </th>
              <th>Dept <Select
                className='basic-single'
                classNamePrefix='select'
                defaultValue={options[0]}
                options={options}
                onChange={this.handleSelectionEvent}
              /></th>
              <th>Syllabus
                <ToggleButton key={'syllabi'}
                  activeLabel={''}
                  inactiveLabel={''}
                  value={this.state.newvalue}
                  onToggle={(value) => {
                    this.setState({
                      newvalue: !value
                    })
                    this.handleToggleForSyllabi(!value)
                  }
                  } />
              </th>
            </tr>
          </thead>
        </Table>
        <Row>
          Search <FormControl type="text" inputRef={el => this.searchbar = el} onChange={this.handleSearchUpdate}
            placeholder="Search a course or description">
          </FormControl>
        </Row>
        <Row><br /></Row>
        <Row>
          {this.state.invalidYearTerm ? <p>Unfortunately, this year and term are not available at the moment.</p> :
            <ResultsTable
              filteredCourses={this.state.filteredCourses}/>
          }
        </Row>
      </Grid>
    )
  }
}

export default App
