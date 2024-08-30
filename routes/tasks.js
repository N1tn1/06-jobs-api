const express = require('express')
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/tasks')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', getTasks)
router.get('/:id', getTaskById)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

module.exports = router