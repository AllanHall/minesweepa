import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  state = {
    game: {},
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
        console.log(gameData)
        console.log(gameData.board)
        this.setState({
          game: gameData,
          board: gameData.board
        })
      })
  }

  render() {
    return (
      <>
        <Header />
        <table className="main">
          <tbody className="game-box">
            {this.state.board.map((row, i) => {
              console.log(row, i)
              return (
                <tr key={i}>
                  {row.map((column, j) => {
                    console.log(column, j)
                    return (
                      <td className="cell" key={j}>
                        {this.state.board[i][j]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }
}

export default App
