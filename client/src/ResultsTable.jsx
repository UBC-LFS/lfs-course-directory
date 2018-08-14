import React from 'react'
import { Table } from 'react-bootstrap'
/*
* Props: courses - list of courses to render
* Renders a table of courses with links to their syllabi
*/
// `<a href='https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=${dept}&course=${course}'>${dept} ${course}</a>`,
class ResultsTable extends React.Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course</th>
            <th>Description</th>
            <th>Syllabus</th>
          </tr>
        </thead>
        <tbody>
          {this.props.filteredCourses.map(course => {
            const link = `https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=${course.dept}&course=${course.course}`
            return (
              <tr key={course.course + course.dept + course.description + course.syllabus}>
                <th style={{ fontWeight: 'normal' }}>
                  {<a href={link}>{course.dept + ' ' + course.course}</a>}
                </th>
                <th style={{ fontWeight: 'normal' }}>
                  {course.description}
                </th>
                <th style={{ fontWeight: 'normal' }}>
                  {course.syllabus}
                </th>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
}

export default ResultsTable
