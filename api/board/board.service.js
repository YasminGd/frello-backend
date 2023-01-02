const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { makeId } = require('../../services/util.service')
const asyncLocalStorage = require('../../services/als.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  remove,
  query,
  getBoardById,
  add,
  update,
}

async function query() {
  try {
    const collection = await dbService.getCollection('board')
    const boards = await collection.find().toArray()
    return boards
  } catch (err) {
    logger.error('cannot find boards', err)
    throw err
  }
}

async function getBoardById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: ObjectId(boardId) })
    return board
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  try {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    delete loggedinUser?.username

    const collection = await dbService.getCollection('board')

    board.createdBy = loggedinUser
    board.labels = [
      {
        id: makeId(8),
        title: '',
        color: 'green',
        class: 'green-opacity',
      },
      {
        id: makeId(8),
        title: '',
        color: 'yellow',
        class: 'yellow-opacity',
      },
      {
        id: makeId(8),
        title: '',
        color: 'orange',
        class: 'orange-opacity',
      },
      {
        id: makeId(8),
        title: '',
        color: 'red',
        class: 'red-opacity',
      },
      {
        id: makeId(8),
        title: '',
        color: 'purple',
        class: 'purple-opacity',
      },
      {
        id: makeId(8),
        title: '',
        color: 'blue',
        class: 'blue-opacity',
      },
    ]
    if (!loggedinUser) board.members = []
    else board.members = [loggedinUser]
    board.createdAt = Date.now()
    board.groups = []
    board.activities = []
    board.isStarred = false

    await collection.insertOne(board)

    return board
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}

async function update(board) {
  try {
    let boardId = board._id
    let id = ObjectId(board._id)
    delete board._id
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: id }, { $set: { ...board } })
    board._id = boardId
    return board
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: ObjectId(boardId) })
    return boardId
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}
