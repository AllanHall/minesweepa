import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  state = {
    game: {},
    board: [],
    display: '',
    value: 0
  }
  componentDidMount() {
    fetch('https://minesweeper-api.herokuapp.com/games', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        difficulty: this.state.value
      })
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

  checkGame = (row, column) => {
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/check`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ row: row, col: column })
      }
    )
      .then(resp => {
        return resp.json()
      })
      .then(gameData => {
        this.setState({
          game: gameData,
          board: gameData.board
        })
        if (this.state.game.state === 'won') {
          this.setState({
            display: 'Winner!'
          })
        } else if (this.state.game.state === 'lost') {
          this.setState({
            display: 'Oh no, I lost!'
          })
        }
      })
  }

  resetGame = () => {
    fetch('https://minesweeper-api.herokuapp.com/games', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        difficulty: this.state.value
      })
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

  flagGame = (e, row, column) => {
    e.preventDefault()
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/flag`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ row: row, col: column })
      }
    )
      .then(resp => {
        return resp.json()
      })
      .then(gameData => {
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
        <select className="select">
          <option value={(this.state.value = 0)} selected>
            Easy
          </option>
          <option value={(this.state.value = 1)}>Medium</option>
          <option value={(this.state.value = 2)}>Hard</option>
        </select>
        <table className="main">
          <tbody className="game-box">
            {this.state.board.map((row, i) => {
              console.log(row, i)
              return (
                <tr key={i}>
                  {row.map((column, j) => {
                    console.log(column, j)
                    return (
                      <td
                        className="cell"
                        key={j}
                        onClick={() => this.checkGame(i, j)}
                        onContextMenu={e => this.flagGame(e, i, j)}
                      >
                        {this.state.board[i][j]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="winner-display">{this.state.display}</div>
        <button className="reset" onClick={() => this.resetGame()}>
          New Game
        </button>
      </>
    )
  }
}

export default App
