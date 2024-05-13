const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const check = (board) => {
  return winCombos.some((combo) => {
    const [first, second, third] = combo
    return board[first] !== "" && board[first] === board[second] && board[first] === board[third]
  })
}

module.exports = { check }
