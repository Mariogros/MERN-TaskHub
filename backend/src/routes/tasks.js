const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// POST /api/tasks - Create a new task
// TODO: Add authentication middleware when user system is implemented
router.post('/tasks', async (req, res) => {
  try {
    const { title, due } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        data: null,
        error: 'Title is required and must be a non-empty string'
      });
    }

    // Create task object
    const taskData = { title: title.trim() };
    
    // Add due date if provided
    if (due) {
      const dueDate = new Date(due);
      if (isNaN(dueDate.getTime())) {
        return res.status(400).json({
          data: null,
          error: 'Invalid date format for due field. Use ISO 8601 format.'
        });
      }
      taskData.due = dueDate;
    }

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      data: task,
      error: null
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      data: null,
      error: 'Internal server error'
    });
  }
});

// GET /api/tasks - Get all tasks or filter by query
router.get('/tasks', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    // Filter by title if query parameter is provided
    if (q) {
      query.title = { $regex: q, $options: 'i' }; // Case-insensitive search
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      data: tasks,
      error: null
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      data: null,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        data: null,
        error: 'Invalid task ID format'
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        data: null,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      data: task,
      error: null
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      data: null,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
