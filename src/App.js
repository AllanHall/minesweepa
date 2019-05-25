import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  state = {
    board: []
  }
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
      .then(gameData => {
        console.log(gameData.board)
        this.setState({
          board: gameData.board
        })
      })
  }

  render() {
    return (
      <>
        <Header />
        <main>
          <div className="game-box">
            <tr>
              {this.state.board.map(cell =>
                )}
            </tr>
          </div>
        </main>
      </>
    )
  }
}

export default App
