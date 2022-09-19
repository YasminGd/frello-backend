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
    update
}

async function query(filterBy) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const criteria = {}
        const collection = await dbService.getCollection('board')
        const boards = await collection.find(criteria).toArray()
        return boards
    }
    catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getBoardById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        return board
    }
    catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        delete loggedinUser.username

        const collection = await dbService.getCollection('board')

        board.createdAt = Date.now()

        board.createdBy = loggedinUser
        board.labels = [
            {
                id: makeId(8),
                title: '',
                color: 'green',
                class: 'green-hoverable',
            },
            {
                id: makeId(8),
                title: '',
                color: 'yellow',
                class: 'yellow-hoverable',
            },
            {
                id: makeId(8),
                title: '',
                color: 'orange',
                class: 'orange-hoverable',
            },
            {
                id: makeId(8),
                title: '',
                color: 'red',
                class: 'red-hoverable',
            },
            {
                id: makeId(8),
                title: '',
                color: 'purple',
                class: 'purple-hoverable',
            },
            {
                id: makeId(8),
                title: '',
                color: 'blue',
                class: 'blue-hoverable',
            },
        ]
        board.style = {
            background:
                '',
            isLabelsLarge: false,
            colorsClasses: [
                'light-green-hoverable',
                'light-yellow-hoverable',
                'light-orange-hoverable',
                'light-red-hoverable',
                'light-purple-hoverable',
                'green-hoverable',
                'yellow-hoverable',
                'orange-hoverable',
                'red-hoverable',
                'purple-hoverable',
                'dark-green-hoverable',
                'dark-yellow-hoverable',
                'dark-orange-hoverable',
                'dark-red-hoverable',
                'dark-purple-hoverable',
                'light-blue-hoverable',
                'light-sky-hoverable',
                'light-lime-hoverable',
                'light-pink-hoverable',
                'light-black-hoverable',
                'blue-hoverable',
                'sky-hoverable',
                'lime-hoverable',
                'pink-hoverable',
                'black-hoverable',
                'dark-blue-hoverable',
                'dark-sky-hoverable',
                'dark-lime-hoverable',
                'dark-pink-hoverable',
                'dark-black-hoverable',

            ]
        }
        board.members = [loggedinUser]
        board.groups = []
        board.activities = []
        board.isStarred = false

        const addedBoard = await collection.insertOne(board)
        return addedBoard
    }
    catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        var id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: id }, { $set: { ...board } })
        return board
    }
    catch (err) {
        logger.error(`cannot update board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    }
    catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}