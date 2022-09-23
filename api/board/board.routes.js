const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getBoards, getBoardById, addBoard, updateBoard, removeBoard/*, addReview */ } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoards)
router.get('/:id', getBoardById)
router.post('/', /*requireAuth*/ addBoard)
router.put('/:id', /*requireAuth*/ updateBoard)
router.delete('/:id', /*requireAuth*/ /*requireAdmin,*/ removeBoard)

module.exports = router
