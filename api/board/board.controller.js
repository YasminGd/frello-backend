const boardService = require('./board.service.js')
const logger = require('../../services/logger.service')
const { broadcast } = require('../../services/socket.service.js')
const asyncLocalStorage = require('../../services/als.service.js')

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
}

// GET LIST
async function getBoards(req, res) {
  try {
    logger.debug('Getting Boards')
    const queryParams = req.queryParams
    const boards = await boardService.query(queryParams)
    res.json(boards)
  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

// GET BY ID
async function getBoardById(req, res) {
  try {
    const boardId = req.params.id
    const board = await boardService.getBoardById(boardId)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

// POST (add board)
async function addBoard(req, res) {
  try {
    const board = req.body
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

// PUT
async function updateBoard(req, res) {
  try {
    const board = req.body
    console.log('updateBoard ~ board', board)
    const updatedBoard = await boardService.update(board)
    const loggedinUser = asyncLocalStorage.getStore().loggedinUser

    broadcast({ type: 'update-board', data: updatedBoard, room: updatedBoard._id, userId: loggedinUser?._id })

    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })
  }
}

// DELETE
async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}
