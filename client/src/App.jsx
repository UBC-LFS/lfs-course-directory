/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl, Table } from 'react-bootstrap'
import 'react-dropdown/style.css'
import './App.css'
import ToggleButton from 'react-toggle-button'
import Select from 'react-select'
import ResultsTable from './ResultsTable'

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
      invalidYearTerm: false
    }
  }

  componentDidMount() {
    this.populateYearTerms()
      .then(({ year, term }) => this.getCoursesForTerm(year, term))
  }

  populateYearTerms = async () => {
    const year = getYear()
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

  getCoursesForTerm = async (year, term) => {
    const response = await fetch(`http://localhost:8081/${year}/${term}`)
    if (response.status === 404) {
      this.setState({
        invalidYearTerm: true
      })
    }
    else {
      const courses = await response.json()
      this.setState({
        invalidYearTerm: false,
        courses: courses,
        filteredCourses: courses
      })
    }
  }

  handleYearTerm = async event => {
    await this.setState({
      selectedYearTerm: event.value
    })
    await this.getCoursesForTerm(this.state.selectedYearTerm.year, this.state.selectedYearTerm.term)
    this.handleChange()
  }

  handleToggleForSyllabi = async newvalue => {
    await this.setState({
      syllabi: newvalue
    })
    this.handleChange()
  }

  handleSyllabi = workingList => workingList
    .map(courses => courses.filter(({ syllabus }) => syllabus))
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
    .map(courses => courses.filter(({ dept }) => dept === this.state.selectedDept))
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


    if (textArray.length > 2) {
      return workingList
        .map(courses => courses.filter(course => this.checkIncludes(course.description.toUpperCase(), textArray)))
        .filter(courses => courses.length !== 0)
    }

    else if (textArray[1]) {
      const secondWord = textArray[1]
      return workingList
        .map(courses => courses.filter(course => ((course.dept.includes(firstWord) || course.dept.includes(secondWord))
          && (course.course.includes(firstWord) || course.course.includes(secondWord)))
          || (course.description.toUpperCase().includes(firstWord) && course.description.toUpperCase().includes(secondWord))))
        .filter(courses => courses.length !== 0)
    }

    else {
      return workingList
        .map(courses => courses.filter(course => course.dept.includes(firstWord)
          || course.course.includes(firstWord)
          || course.description.toUpperCase().includes(firstWord)))
        .filter(courses => courses.length !== 0)
    }
  }

  checkIncludes = (description, words) => {
    return words.reduce((acc, cur) => {
      if (!description.includes(cur)) {
        acc = false
      }
      return acc
    }, true)
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
          </Col>
        </Row>
        <Row><br /></Row>
        <Table condensed hover>
          <thead>
            <tr>
              <th>Session <Select
                className='basic-single'
                classNamePrefix='select'
                defaultValue={this.state.availableTerms[0]}
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
            placeholder="Search a course code... (ex: FNH 200)">
          </FormControl>
        </Row>
        <Row>
          {this.state.invalidYearTerm ? <p>Unfortunately, this year and term are not available at the moment.</p> :
            <ResultsTable
              filteredCourses={this.state.filteredCourses}
              syllabi={this.state.syllabi} />
          }
        </Row>
      </Grid>
    )
  }
}

export default App