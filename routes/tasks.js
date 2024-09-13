const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/tasks')


router.route('/').post(auth, createTask).get(getTasks)
router.route('/:id').get(getTaskById).delete(deleteTask).patch(updateTask)

module.exports = router