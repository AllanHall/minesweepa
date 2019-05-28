import React, { Component } from 'react'

class Select extends Component {
  render() {
    return (
      <>
        <select className="select">
          <option value="0">Easy</option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
      </>
    )
  }
}

export default Select
