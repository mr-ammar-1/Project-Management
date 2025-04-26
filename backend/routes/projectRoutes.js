const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Routes for CRUD operations on projects
router.get('/api/projects', authMiddleware.authenticateUser, projectController.getAllProjects);
router.get('/api/projects/:id', authMiddleware.authenticateUser, projectController.getProjectById);
router.post('/api/projects', authMiddleware.authenticateUser, projectController.addProject);
router.delete('/api/projects/:id', authMiddleware.authenticateUser, projectController.deleteProject);
router.delete('/api/tasks/:id', authMiddleware.authenticateUser, projectController.deleteTasks);


// Invite Collaborators

router.post('/api/projects/:projectId/collaborators', authMiddleware.authenticateUser, projectController.inviteCollaborator);

// router.get('/api/projects/userprojects', projectController.getUserProjects);

router.get('/api/projectsDisplay/userfromprojects', authMiddleware.authenticateUser, projectController.getUserfromProjects);

// Routes for Tasks
router.post('/api/tasks', authMiddleware.authenticateUser, projectController.addTask);
router.put('/api/tasks/status', authMiddleware.authenticateUser, projectController.updateTaskStatus);

router.put('/api/tasks/priority/:id', authMiddleware.authenticateUser, projectController.updatePriorityOfTask);
router.put('/api/tasks/repeats/:id', authMiddleware.authenticateUser, projectController.updateTaskRepeats);

router.post('/api/tasks/assign', authMiddleware.authenticateUser, projectController.assignTask);
router.get('/api/tasks/:id', authMiddleware.authenticateUser, projectController.getTaskById);
router.get('/api/tasks/project/:id', authMiddleware.authenticateUser, projectController.getTasksByProjectId);
router.get('/api/tasks', authMiddleware.authenticateUser, projectController.getAllTasks); // Add this route
router.get('/api/tasks/due-tomorrow/:email', authMiddleware.authenticateUser, projectController.getTasksDueTomorrowByEmail);

router.put ('/api/tasks/:id/progress', authMiddleware.authenticateUser, projectController.updateTaskProgress);
router.get('/api/reports/project/:id', authMiddleware.authenticateUser, projectController.generateReport);
router.post('/api/:taskId/comments', authMiddleware.authenticateUser, projectController.taskComments);
router.get('/api/:taskId/comments', authMiddleware.authenticateUser, projectController.getComments);

router.get('/api/tasks/getTasksByUser/:id', authMiddleware.authenticateUser, projectController.getTasksByUser);


module.exports = router;
