import React from 'react'
import { Table } from 'react-bootstrap'
/*
* Props: courses - list of courses to render
* Renders a table of courses with links to their syllabi
*/

class ResultsTable extends React.Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Department</th>
            <th>Section</th>
            <th>Description</th>
            <th>Syllabus</th>
          </tr>
        </thead>
        <tbody>
          {this.props.filteredCourses.map(course => {
            return (
              <tr key={course.dept + course.course + course.description + course.syllabus}>
                <th style={{ fontWeight: 'normal' }}>
                  {course.dept}
                </th>
                <th style={{ fontWeight: 'normal' }}>
                  {course.course}
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
