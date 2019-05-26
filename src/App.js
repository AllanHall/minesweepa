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
            {this.state.board.map((row, i) => {
              console.log(row, i)
              return (
                <div>
                  {row.map((column, j) => {
                    console.log(column, j)
                    return <div className="cell">{this.state.board[i][j]}</div>
                  })}
                </div>
              )
            })}
          </div>
        </main>
      </>
    )
  }
}

export default App
