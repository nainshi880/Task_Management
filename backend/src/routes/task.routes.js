const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.taskValidation, validate, taskController.createTask);
router.put('/:id', taskController.taskValidation, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
