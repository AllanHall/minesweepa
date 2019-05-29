import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  state = {
    game: {},
    board: [],
    display: '',
    value: '0'
  }
  componentDidMount() {
    this.resetGame()
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
        this.setState({
          game: gameData,
          board: gameData.board
        })
        this.setState({
          display: ''
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

  updateDifficulty = event => {
    console.log(event.target.value)
    this.setState(
      {
        value: event.target.value
      },
      () => {
        this.resetGame()
      }
    )
  }

  // Overlay

  openOverlay = () => {
    ;<div
      className="overlay"
      style={{
        height: '100%'
      }}
    />
  }

  closeOverlay = () => {
    ;<div
      className="overlay"
      style={{
        height: '0%'
      }}
    />
  }

  render() {
    return (
      <>
        <Header />
        <select className="select" onChange={this.updateDifficulty}>
          <option value="0" selected>
            Easy
          </option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
        <table className="main">
          <tbody className="game-box">
            {this.state.board.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((column, j) => {
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
        <button className="reset" onClick={() => this.resetGame()}>
          New Game
        </button>
        {/* Overlay, Make this first span sync with game state, line 34*/}
        <button className="open-overlay" onClick={this.openOverlay()}>
          open
        </button>
        <div className="Nav" className="overlay" />
        <a
          href="javascript:void(0)"
          className="closeBtn"
          // add reset function to this button
          onClick={this.closeOverlay()}
        >
          New Game?
        </a>
        <div className="overlay-content">
          <div className="winner-display">{this.state.display}</div>
        </div>
      </>
    )
  }
}

export default App
