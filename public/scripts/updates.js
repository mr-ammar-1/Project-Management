document.addEventListener('DOMContentLoaded', () => {
    fetchAllTasks();
    fetchTasks();
    const updateTaskStatusForm = document.getElementById('updateTaskStatusForm');
    updateTaskStatusForm.addEventListener('submit', updateStatus);

    
});
function fetchTasks() {
    
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('https://project-management-255c.vercel.app/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
        .then(response => response.json())
        .then(tasks => {
            const taskDropdown = document.getElementById('taskId');
            taskDropdown.innerHTML = '';
            tasks.forEach(task => {
                const option = document.createElement('option');
                option.value = task._id;
                option.textContent = task.title;
                taskDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}



function fetchAllTasks() {
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    
    fetch(`https://project-management-255c.vercel.app/api/tasks`, {
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
        const completedTasks = tasks.filter(task => task.status === 'completed');
        completedTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.textContent = `${task.title} - ${task.status}`;
            taskContainer.appendChild(taskElement);
        });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}


function updateStatus(event) {
    event.preventDefault();

    const taskId = document.getElementById('taskId').value;
    const status = document.getElementById('status').value;
    const completedBy = localStorage.getItem("email");

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    // Determine progress based on status
    let progress = 0;
    switch (status) {
        case 'todo':
            progress = 0;
            break;
        case 'in_progress':
            progress = 50;
            break;
        case 'completed':
            progress = 100;
            break;
        case 'archived':
            progress = 100;
            break;
        default:
            progress = 0;
    }

    fetch('https://project-management-255c.vercel.app/api/tasks/status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify({
            task_id: taskId,
            status: status,
            progress: progress, // Include progress in the request
            completed_by: completedBy
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error updating task status:', error));
}