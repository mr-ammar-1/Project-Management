document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    // fetchAllTasks();
    fetchProjects();
    fetchAssignees();
   
   
});

function fetchAllTasks() {
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    
    fetch(`http://localhost:3000/api/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(tasks => {
        const taskContainer = document.getElementById('taskContainer');
        taskContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.textContent = `${task.title} - ${task.status}`;
            taskContainer.appendChild(taskElement);
        });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function fetchProjects() {
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/api/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(projects => {
        const projectDropdown = document.getElementById('projectDropdown');
        projectDropdown.innerHTML = '';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project._id;
            option.textContent = project.name;
            projectDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching projects:', error));
}

function loadComments(taskId) {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    fetch(`http://localhost:3000/api/${taskId}/comments`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
    })
      .then(res => res.json())
      .then(comments => {
        if (!Array.isArray(comments)) {
          console.error("Unexpected response:", comments);
          return;
        }

        const list = document.getElementById('commentsList');
        list.innerHTML = '';
        comments.forEach(c => {
          const li = document.createElement('li');
          li.textContent = `${c.commented_by}: ${c.text}`;
          list.appendChild(li);
        });
      })
      .catch(err => console.error("Error loading comments:", err));
}


function addComment() {
    const text = document.getElementById('newComment').value.trim();
    const commented_by = localStorage.getItem('email');
    const taskId = document.getElementById('taskId').value;

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    console.log("Sending comment:", { text, commented_by });

    if (!text || !commented_by || !taskId) {
        console.error("Missing text, email, or taskId");
        return;
    }

    fetch(`http://localhost:3000/api/${taskId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify({ text, commented_by })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from server:", data);
        document.getElementById('newComment').value = '';
        loadComments(taskId);
    })
    .catch(err => console.error('Error adding comment:', err));
}

  


function fetchTasks() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    fetch('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(tasks => {
        renderTasks(tasks);
        // renderTasksForComments(tasks); // Render tasks for comments
        populateTaskDropdown(tasks); // Populate <select id="taskId">
        populateTaskAssignDropdown(tasks)
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

// Render Tasks in List


// Render Tasks with Progress Bars
// Function to determine progress percentage based on status
// **Render Tasks with Progress Bars**

function renderTasks(tasks) {
    console.log("Rendering Tasks:", tasks);

    const taskContainer = document.getElementById('taskContainer');
    if (!taskContainer) {
        console.error("taskContainer not found in DOM!");
        return;
    }

    taskContainer.innerHTML = ''; // Clear previous tasks

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');

        // Task Title & Status
        const taskText = document.createElement('div');
        taskText.textContent = `${task.title} - ${task.status.replace('_', ' ')}`;

        // Progress Bar
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar', task.status);
        progressBar.style.width = `${task.progress || 0}%`;

        const progressText = document.createElement('span');
        progressText.textContent = `${task.progress || 0}%`;
        progressText.classList.add('progress-text');

        progressBarContainer.appendChild(progressBar);
        progressBarContainer.appendChild(progressText);

        // Comments Section (shown inline with each task)
        const commentsSection = document.createElement('div');
        commentsSection.classList.add('task-comments');

        const commentsHeader = document.createElement('h4');
        commentsHeader.textContent = 'Comments:';

        const commentsList = document.createElement('ul');
        if (Array.isArray(task.comments) && task.comments.length > 0) {
            task.comments.forEach(comment => {
                const commentItem = document.createElement('li');
                commentItem.innerHTML = `<strong>${comment.commented_by}</strong>: ${comment.text} 
                    <small>(${new Date(comment.commented_at).toLocaleString()})</small>`;
                commentsList.appendChild(commentItem);
            });
        } else {
            const noComments = document.createElement('li');
            noComments.textContent = 'No comments yet.';
            commentsList.appendChild(noComments);
        }

        commentsSection.appendChild(commentsHeader);
        commentsSection.appendChild(commentsList);

        // Append everything to task item
        li.appendChild(taskText);
        li.appendChild(progressBarContainer);
        li.appendChild(commentsSection);

        taskContainer.appendChild(li);
    });
}

// **Progress Percentage Calculation**
const getProgressPercentage = (status) => {
    switch (status) {
        case 'todo': return 0;
        case 'in_progress': return 50;
        case 'completed': return 100;
        case 'archived': return 100;
        default: return 0;
    }
};

// Example: Call this function with mock tasks to test

function renderTasksForComments(tasks) {
    const container = document.getElementById('taskContainer');
    container.innerHTML = '';
  
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;
  
      // Set click event to load comments and store Task ID
      li.onclick = () => {
        document.getElementById('selectedTaskId').value = task._id;
        loadComments(task._id); // load comments for this task
      };
  
      container.appendChild(li);
    });
  }

// Filter Tasks Based on Search and Status
function filterTasks() {
    const searchQuery = document.getElementById('taskSearch').value.toLowerCase();
    const filterStatus = document.getElementById('taskFilter').value;

    document.querySelectorAll('#taskContainer li').forEach(task => {
        const text = task.textContent.toLowerCase(); // Example: "Buy groceries - Pending"
        const [title, status] = text.split(" - ");
        
        console.log(title); // "Buy groceries"
        console.log(status); // "Pending"
        // console.log(status);

        // Show task if it matches search query and selected status
        if (title.includes(searchQuery) && (filterStatus === "all" || status === filterStatus)) {
            task.style.display = "list-item";
        } else {
            task.style.display = "none";
        }
    });
}


function fetchAssignees() {
    
    fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
         
          
        }
    })
        .then(response => response.json())
        .then(users => {
            const assigneeDropdown = document.getElementById('assigneeId');
            assigneeDropdown.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user._id;
                option.textContent = user.username;
                assigneeDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}
function assignTask() {
    const taskId = document.getElementById('taskId').value;
    const assigneeId = document.getElementById('assigneeId').value;
    const allocatedBy = localStorage.getItem("email");
    // console.log("this is task id ",assigneeId)
    const taskData = {
        task_id: taskId,
        assignee_id: assigneeId,
        allocated_by: allocatedBy
    };

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/api/tasks/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task assigned successfully, notification sent') {
            alert('Task assigned successfully');
        } else {
            console.error('Error assigning task:', data.message);
        }
    })
    .catch(error => console.error('Error assigning task:', error));
}
function addTask() {
    const taskInput = document.getElementById('taskInput').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const dueDate = document.getElementById('dueDate').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const projectId = document.getElementById('projectDropdown').value;
   

    console.log("this is task data ",taskInput)
    const taskData = {
        title: taskInput,
        description: projectDescription,
        status: taskStatus,
        due_date: dueDate,
        created_by: localStorage.getItem('email'), // Assume user ID is stored in localStorage
        project_id: projectId,
    };

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task added successfully') {
            alert('Task added successfully');
            fetchTasks();
        } else {
            console.error('Error adding task:', data.message);
        }
    })
    .catch(error => console.error('Error adding task:', error));
}

function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project_id');
}

function populateTaskDropdown(tasks) {
    const taskDropdown = document.getElementById('taskId');
    taskDropdown.innerHTML = ''; // Clear previous options

    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task._id; // Use the task ID as value
        option.textContent = task.title; // Display task title
        taskDropdown.appendChild(option);
    });
}
function populateTaskAssignDropdown(tasks) {
    const taskDropdown = document.getElementById('assigntaskId');
    taskDropdown.innerHTML = ''; // Clear previous options

    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task._id; // Use the task ID as value
        option.textContent = task.title; // Display task title
        taskDropdown.appendChild(option);
    });
}