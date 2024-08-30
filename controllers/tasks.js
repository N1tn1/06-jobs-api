const Task = require('../models/Task')

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error })
  }
}

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task', error })
  }
}

const createTask = async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, userId: req.userId })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error })
  }
}

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    )
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' })
    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error })
  }
}

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}