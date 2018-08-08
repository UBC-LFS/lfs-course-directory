/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl, Table } from 'react-bootstrap'
import 'react-dropdown/style.css'
import './App.css'
import ToggleButton from 'react-toggle-button'
import Select from 'react-select'
import ResultsTable from './ResultsTable'
import {exampleInputW} from './inputW'
import {exampleInputS} from './inputS'

const options = [
  { value: '-', label: '-' }, 
  { value: 'APBI', label: 'APBI'}, 
  { value: 'FNH', label:'FNH'},
  { value: 'FOOD', label:'FOOD'},
  { value: 'FRE', label:'FRE'},
  { value: 'GRS', label:'GRS'},
  { value: 'HUNU', label:'HUNU'},
  { value: 'LFS', label:'LFS'},
  { value: 'LWS', label:'LWS'},
  { value: 'PLNT', label:'PLNT'},
  { value: 'SOIL', label:'SOIL'},
]

const yearTerms = [
  { value: '2018W', label: '2018 Winter'},
  { value: '2018S', label: '2018 Summer'}
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      activeTerm: '2018W',
      syllabi: false,
      resultCourses: [],
      selection: null,
      searchBar: false
    }
  }

  componentDidMount () {
    this.getCoursesForTerm(this.state.activeTerm)
  }

  getCoursesForTerm = async (term) => {
    // const courses = await fetch(`http://localhost:8081/${term}`)
    //   .then(x => x.json())
    
    if (term === '2018W') {
      this.setState({
        courses: exampleInputW,
        resultCourses: exampleInputW
      })
    } else {
      this.setState({
        courses: exampleInputS,
        resultCourses: exampleInputS
      })
    }
  }

  handleToggleForTerm = async value => {
    if (value) {
      await this.setState({
        activeTerm: 'S'
      })
    } else {
      await this.setState({
        activeTerm: 'W'
      })
    }
    this.getCoursesForTerm(this.state.activeTerm)

    this.handleChange()
  }

  handleYearTerm = async event => {
    if (event.value === '2018W') {
      await this.setState({
        activeTerm: '2018W'
      })
    } else {
      await this.setState({
        activeTerm: '2018S'
      })
    }
    this.getCoursesForTerm(this.state.activeTerm)

    this.handleChange()
  }

  handleToggleForSyllabi = async newvalue => {
    await this.setState({
      syllabi: newvalue
    })
    this.handleChange()
  }

  handleSyllabi = (workingList) => {
    workingList = workingList.map(courses => {
      return courses.filter(coursesByDept => coursesByDept.syllabus)
    })
    workingList = workingList.filter(courses => courses.length !== 0)
    return workingList
  }
  
  handleSelectionEvent = async event => {
    if (event.value === '-') {
      await this.setState({
        selection: null
      })
    } else {
      await this.setState({
        selection: event.value
      })
    }

    this.handleChange()
  }

  handleSelection = workingList => {
    workingList = workingList.map(courses =>
      courses.filter(course => {
        return (course.dept === this.state.selection)
      }))
    workingList = workingList.filter(courses => courses.length !== 0)
    return workingList
  }

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
    let text = this.state.searchBar

    workingList = workingList.map(courses =>
      courses.filter(course => {
        return course.dept.includes(text[0]) || 
          course.course.includes(text[0]) || 
          course.description.toUpperCase().includes(text[0])
      }))
    
    if (text[1]) {
      workingList = workingList.map(courses => 
        courses.filter(course => {
          return ((course.dept.includes(text[0]) || course.dept.includes(text[1])) && 
            (course.course.includes(text[0]) || course.course.includes(text[1]))) ||
            (course.description.toUpperCase().includes(text[0]) && course.description.toUpperCase().includes(text[1]))
        }))
    }

    if (text.length > 2) {
      workingList = workingList.map(courses =>
        courses.filter(course => {
          return this.checkIncludes(course.description.toUpperCase(), text)
        }))
    }

    workingList = workingList.filter(courses => courses.length !== 0)
    return workingList
  }

  /**helper function for handleSearchFilter
   * takes a string and an array of strings and see if string contains the elements of the array
   * @param string description
   * @param array words
   * @returns boolean
   */
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
    if (this.state.selection !== null) {
      workingList = this.handleSelection(workingList)
    }
    // check search bar
    if (this.state.searchBar) {
      workingList = this.handleSearchFilter(workingList)
    }

    // set resultCourses: masterList
    this.setState({
      resultCourses: workingList
    })
  }

  render () {
    return (
      <Grid>
        <Row className='show-grid'>
          <Col>
            <h2>Course Directory</h2>
          </Col>
        </Row>
        <Row><br /></Row>
        <Table condensed hover>
          <thead>
            <tr>
              <th>YearTerm <Select
                className='basic-single'
                classNamePrefix='select'
                defaultValue={yearTerms[0]}
                options= {yearTerms}
                onChange={this.handleYearTerm}
                />
              </th>
              {/* <th>Term <ToggleButton key={'term'}
                activeLabel={'S'}
                inactiveLabel={'W'}
                value={this.state.value}
                onToggle={(value) => {
                  this.setState({
                    value: !value
                  })
                  this.handleToggleForTerm(!value)}
                } />
              </th> */}
              <th>Dept <Select
                className='basic-single'
                classNamePrefix='select'
                defaultValue={options[0]}
                options= {options}
                onChange={this.handleSelectionEvent}
                /></th>
                <th dataAlign='center'>Syllabus
                <ToggleButton key={'syllabi'}
                activeLabel={''}
                inactiveLabel={''}
                value={this.state.newvalue}
                onToggle={(value) => {
                  this.setState({
                    newvalue: !value
                  })
                  this.handleToggleForSyllabi(!value)}
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
          <ResultsTable 
            resultCourses={this.state.resultCourses}
            syllabi={this.state.syllabi}/>
        </Row>
      </Grid>
    )
  }
}

export default App