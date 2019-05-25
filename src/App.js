import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  componentDidMount() {
    fetch('https://minesweeper-api.herokuapp.com/games', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ difficulty: 0 })
    })
      .then(resp => {
        return resp.json()
      })
      .then(game => {
        console.log(game)
      })
  }
  render() {
    return (
      <>
        <Header />
        <main>
          <div className="game-box" />
        </main>
      </>
    )
  }
}

export default App
