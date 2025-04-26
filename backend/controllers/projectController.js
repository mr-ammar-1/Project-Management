const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
// const { ObjectId } = mongoose.Types;
const { v4: uuidv4 } = require('uuid');

// Add Project
exports.addProject = async (req, res) => {
  const { name, description, created_by, status } = req.body;

  try {
    const newProject = new Project({

      name,
      description,
      created_by,
      status
    });

    await newProject.save(); // Save the new project to the database
    res.status(201).json({ message: 'Project added successfully', _id });
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  // console.log("Received ID:", req.params.id);


  try {

    const deletedProject = await Project.findOneAndDelete({ _id: req.params.id });

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};
// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects from MongoDB
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  const { project_id } = req.params;

  try {
    const project = await Project.findOne({ project_id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Add Task
exports.addTask = async (req, res) => {
  console.log('Add Task', req.body);

  const { title, description, status, due_date, created_by, project_id } = req.body;
  const created_at = new Date().toISOString();
  
  try {
    const user = await User.findOne({ email: created_by });
    if (!user) {
      return res.status(404).json({ message: 'Creator user not found with given email' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      due_date,
      created_by: user._id,  // Save user id instead of email
      project_id,
      created_at
    });

    await newTask.save(); // Save the new task to the database
    res.status(201).json({ message: 'Task added successfully', task_id });
  } catch (error) {
    res.status(500).json({ message: 'Error adding task', error: error.message });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { email } = req.query;


    if (!email) {
      // No email → return all tasks
      const tasks = await Task.find();
      return res.status(200).json(tasks);
    }

    // Email is present → find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with given email' });
    }

    // Now get tasks assigned to this user
    const tasks = await Task.find({
      $or: [
        { assignee_id: user._id },
        { created_by: user._id }
      ]
    });

    console.log(tasks)

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  const { task_id, progress, status, completed_by } = req.body;
  const completed_at = status === 'completed' ? new Date().toISOString() : null;
  console.log("Status of Task", req.body)

  const user = await User.findOne({ email: completed_by });
  if (!user) {
    return res.status(404).json({ message: 'User not found with given email' });
  }

  console.log(user.email)
  if (status === 'completed') {
  
    user.completed_tasks += 1;

    // 6. Badge logic
    const badgeList = [];
    if (user.completed_tasks === 1)
      badgeList.push({ name: 'First Task!', description: 'You completed your first task!' });
    if (user.completed_tasks === 10)
      badgeList.push({ name: '10 Tasks Done', description: 'You’ve completed 10 tasks!' });
    if (user.completed_tasks === 50)
      badgeList.push({ name: 'Task Master', description: '50 tasks under your belt!' });

    badgeList.forEach(badge => {
      if (!user.badges.some(b => b.name === badge.name)) {
        user.badges.push(badge);
      }
    });

    // 7. Rank logic
    if (user.completed_tasks >= 50) user.rank = 'Pro';
    else if (user.completed_tasks >= 10) user.rank = 'Intermediate';
    else user.rank = 'Beginner';

    await user.save();
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: task_id },
      { status, progress, completed_at, completed_by },
      { new: true }
    );


    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};


// exports.updateTaskStatus = async (req, res) => {
//   const { task_id,progress, status, completed_by } = req.body;
//   const completed_at = status === 'completed' ? new Date().toISOString() : null;
//   console.log("Status of Task",req.body)
//   try {


// const user = await User.findOne({ email: completed_by });
// if (!user) {
//   return res.status(404).json({ message: 'User not found with given email' });
// }

//     const task = await Task.findById(task_id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     if (task.assignee_id !== user._id.toString()) {
//       return res.status(403).json({ message: 'Only assignee can update this task' });
//     }

//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: task_id  },
//       { status,progress, completed_at, completed_by },
//       { new: true }
//     );

//     console.log(updatedTask.status)


//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     res.status(200).json({ message: 'Task status updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating task status', error: error.message });
//   }
// };

exports.generateReport = async (req, res) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({ project_id: projectId });

    const totalTasks = tasks.length;
    const statusCount = {
      todo: 0,
      in_progress: 0,
      completed: 0,
      archived: 0,
    };
    let totalProgress = 0;

    tasks.forEach(task => {
      statusCount[task.status]++;
      totalProgress += task.progress || 0;
    });

    const avgProgress = totalTasks > 0 ? (totalProgress / totalTasks).toFixed(2) : 0;

    res.json({
      totalTasks,
      statusCount,
      avgProgress,
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.taskComments = async (req, res) => {
  console.log("Incoming comment request body:", req.body);
  console.log("Task ID:", req.params.taskId);

  const { text, commented_by } = req.body;

  if (!text || !commented_by) {
    return res.status(400).json({ message: 'Missing text or commented_by' });
  }

  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ text, commented_by });
    await task.save();

    res.json({ message: 'Comment added successfully', comments: task.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).select('comments');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updatePriorityOfTask = async (req, res) => {
  const taskId = req.params.id;
  const { priority } = req.body;
  console.log("Priority of Task", req.body);
  try {
    const validatePriorities = ["low", "medium", "high"];
    if (!validatePriorities.includes(priority)) {
      return res.status(400).json({ error: "Invalid Priority Value." });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { priority: priority },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task priority updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task priority", error: error.message });
  }
};

exports.updateTaskRepeats = async (req, res) => {
  const taskId = req.params.id;
  const { repeats } = req.body;
  console.log("Repeats of Task", req.body);
  try {
    const validateRepeats = ["none", "daily", "weekly", "monthly"];
    if (!validateRepeats.includes(repeats)) {
      return res.status(400).json({ error: "Invalid repeats value" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { repeats },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task repeats updated successfully." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task repeats", error: error.message });
  }
};



// Change Task Status (Assign Task)
exports.assignTask = async (req, res) => {

  const { task_id, assignee_id, allocated_by } = req.body;
  const allocated_at = new Date().toISOString();


  try {
    // Update Task assignment in the database
    const updatedTask = await Task.findOneAndUpdate(
      { _id: task_id },
      { assignee_id, allocated_by, allocated_at },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Fetch task title for notification
    const message = `You have been assigned a new task: ${updatedTask.title}`;

    // Create a new notification
    const notification = new Notification({

      user_id: assignee_id,
      message,
      type: 'assignment',
      is_read: false,
      created_at: new Date().toISOString(),
      related_task_id: task_id
    });

    await notification.save(); // Save the notification to the database
    console.log(notification);

    res.status(200).json({ message: 'Task assigned successfully, notification sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
};

exports.updateTaskProgress = async (req, res) => {
  try {
    const { status } = req.body;
    const progress = getProgress(status);

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status, progress }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error });
  }
};

// Get Tasks by Project ID
exports.getTasksByProjectId = async (req, res) => {
  const { project_id } = req.params;

  try {
    const tasks = await Task.find({ project_id }); // Fetch all tasks for a given project
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  const { task_id } = req.params;

  try {
    const task = await Task.findOne({ task_id }); // Fetch task by task_id
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Get Tasks Due Tomorrow by User's Email
exports.getTasksDueTomorrowByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Step 1: Get user_id from email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_id = user.user_id;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Step 2: Fetch tasks where due_date is tomorrow and assigned to this user
    const tasks = await Task.find({ assignee_id: user_id, due_date: formattedTomorrow });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

exports.deleteTasks = async (req, res) => {
  // console.log("Received ID:", req.params.id);


  try {

    const deletedTasks = await Task.findOneAndDelete({ _id: req.params.id });

    if (!deletedTasks) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Task", error: error.message });
  }
};
exports.getTasksByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const tasks = await Task.find({ assignee_id: userId });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks by user", error: error.message });
  }
};


exports.inviteCollaborator = async (req, res) => {
  try {
      const { email } = req.body; // The email of the user you want to invite
      const projectId = req.params.projectId;

      console.log(req.body)

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Prevent duplicate invitations
      if (project.collaborators.includes(user._id)) {
          return res.status(400).json({ message: 'User already a collaborator' });
      }

      project.collaborators.push(user._id);
      await project.save();

      res.status(200).json({ message: 'Collaborator added successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.getUserProjects = async (req, res) => {
//   console.log("Hello from here");

//   try {
//       const userId = req.headers.userid; // use lower-case in headers to avoid mismatch

//       if (!userId) {
//           return res.status(400).json({ message: "User ID is required" });
//       }

//       const projects = await Project.find({
//           $or: [
//               { created_by: userId },
//               { collaborators: userId }
//           ]
//       });
//       res.json(projects); // always return an array
//   } catch (error) {
//       console.error("Error fetching user projects:", error);
//       res.status(500).json({ message: "Server Error" });
//   }
// };


exports.getUserfromProjects = async (req, res) => {
  console.log("Hello from here");

  try {
      const userId = req.headers.userid; // use lower-case in headers to avoid mismatch

      if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const projects = await Project.find({
          $or: [
              { created_by: userId },
              { collaborators: userId }
          ]
      });
      res.json(projects); // always return an array
  } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ message: "Server Error" });
  }
};

