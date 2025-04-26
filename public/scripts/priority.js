document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
    fetchAllTasks();
    fetchProjects();
    fetchAssignees();
  });
  
  function getPriorityColor(priority) {
      switch (priority.toLowerCase()) {
        case 'low':
          return '#4CAF50'; // Green
        case 'medium':
          return '#FF9800'; // Orange
        case 'high':
          return '#F44336'; // Red
        default:
          return '#9E9E9E'; // Grey as fallback
      }
  }
  
  function fetchAllTasks() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
  
    fetch(`https://project-management-255c.vercel.app/api/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
    })
      .then((response) => response.json())
      .then((tasks) => {
        // const taskContainer = document.getElementById('taskContainer');
        // taskContainer.innerHTML = '';
        // tasks.forEach(task => {
        //     const taskElement = document.createElement('li');
        //     taskElement.textContent = `${task.title} - ${task.status} - ${task.priority}`;
        //     taskContainer.appendChild(taskElement);
        // });
  
        const taskTableBody = document.getElementById("taskTableBody");
        taskTableBody.innerHTML = "";
  
        tasks.forEach((task) => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
                  <td>${task.title}</td>
                  <td>${task.status}</td>
                  <td>
                    <span style="
                      background-color: ${getPriorityColor(task.priority)};
                      color: white;
                      padding: 4px 8px;
                      border-radius: 6px;
                      font-size: 12px;
                      font-weight: 500;
                      text-transform: capitalize;
                    ">
                      ${task.priority}
                    </span>
                  </td>
                  <td>${task.repeats}</td>
                  <td><button class="edit-btn" data-id="${
                    task._id
                  }" data-priority="${task.priority}">Edit Priority</button></td>
                  <td><button class="edit-btn-repeats" data-id="${
                    task._id
                  }" data-repeats="${task.repeats}">Edit Repeats</button></td>
              `;
  
          taskTableBody.appendChild(row);
        });
  
        // Attach modal open logic
        document.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            selectedTaskId = e.target.getAttribute("data-id");
            const currentPriority = e.target.getAttribute("data-priority");
            document.getElementById("prioritySelect").value = currentPriority;
            document.getElementById("editModal").style.display = "block";
          });
        });
  
        // Attach modal open logic
        document.querySelectorAll(".edit-btn-repeats").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            selectedTaskId = e.target.getAttribute("data-id");
            const currentRepeats = e.target.getAttribute("data-repeats");
            document.getElementById("repeatsSelect").value = currentRepeats;
            document.getElementById("editModalRepeats").style.display = "block";
          });
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }
  
  // Modal for Priority close logic
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
  });
  
  // Modal for Repeats close logic
  document.getElementById("closeModalRepeats").addEventListener("click", () => {
    document.getElementById("editModalRepeats").style.display = "none";
  });
  
  // Save priority logic
  document.getElementById("savePriorityBtn").addEventListener("click", () => {
    const newPriority = document.getElementById("prioritySelect").value;
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
  
    alert(selectedTaskId + newPriority);
  
    fetch(`https://project-management-255c.vercel.app/api/tasks/priority/${selectedTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      body: JSON.stringify({ priority: newPriority }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update priority");
        return res.json();
      })
      .then(() => {
        document.getElementById("editModal").style.display = "none";
        fetchAllTasks(); // Refresh task list
      })
      .catch((err) => console.error("Error updating task:", err));
  });
  
  // Save Repeats logic
  document.getElementById("saveRepeatsBtn").addEventListener("click", () => {
    const newRepeats = document.getElementById("repeatsSelect").value;
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
  
    alert(selectedTaskId + newRepeats);
  
    fetch(`https://project-management-255c.vercel.app/api/tasks/repeats/${selectedTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      body: JSON.stringify({ repeats: newRepeats }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update repeats");
        return res.json();
      })
      .then(() => {
        document.getElementById("editModalRepeats").style.display = "none";
        fetchAllTasks(); // Refresh task list
      })
      .catch((err) => console.error("Error updating task:", err));
  });
  
  function fetchProjects() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch("https://project-management-255c.vercel.app/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
    })
      .then((response) => response.json())
      .then((projects) => {
        const projectDropdown = document.getElementById("projectDropdown");
        projectDropdown.innerHTML = "";
        projects.forEach((project) => {
          const option = document.createElement("option");
          option.value = project._id;
          option.textContent = project.name;
          projectDropdown.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }
  
  function fetchTasks() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
  
    fetch("https://project-management-255c.vercel.app/api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
    })
      .then((response) => response.json())
      .then((tasks) => {
      //   renderTasks(tasks);
        populateTaskDropdown(tasks); // Populate <select id="taskId">
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }
  
  // Render Tasks in List
  function renderTasks(tasks) {
    const taskContainer = document.getElementById("taskContainer");
    taskContainer.innerHTML = "";
  
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${task.title} - ${task.status}`;
      li.setAttribute("data-status", task.status.toLowerCase()); // Store status for filtering
      taskContainer.appendChild(li);
    });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // Filter Tasks Based on Search and Status
  // function filterTasks() {
  //   const searchQuery = document.getElementById("taskSearch").value.toLowerCase();
  //   const filterStatus = document.getElementById("taskFilter").value;
  
  //   document.querySelectorAll("#taskContainer li").forEach((task) => {
  //     const text = task.textContent.toLowerCase(); // Example: "Buy groceries - Pending"
  //     const [title, status] = text.split(" - ");
  
  //     console.log(title); // "Buy groceries"
  //     console.log(status); // "Pending"
  //     // console.log(status);
  
  //     // Show task if it matches search query and selected status
  //     if (
  //       title.includes(searchQuery) &&
  //       (filterStatus === "all" || status === filterStatus)
  //     ) {
  //       task.style.display = "list-item";
  //     } else {
  //       task.style.display = "none";
  //     }
  //   });
  // }
  
  function filterTasks() {
      const searchQuery = document.getElementById("taskSearch").value.toLowerCase();
      const filterStatus = document.getElementById("taskFilter").value;
    
      // Loop over each row inside the task table
      document.querySelectorAll("#taskTableBody tr").forEach((row) => {
        const title = row.children[0].textContent.toLowerCase(); // 1st column: title
        const status = row.children[1].textContent.toLowerCase(); // 2nd column: status
    
        // Check if row should be shown
        const matchesSearch = title.includes(searchQuery);
        const matchesStatus = filterStatus === "all" || status === filterStatus.toLowerCase();
    
        if (matchesSearch && matchesStatus) {
          row.style.display = "table-row";
        } else {
          row.style.display = "none";
        }
      });
    }
    
  
  
  
  
  
  
  
  
  
  
  function fetchAssignees() {
    fetch("https://project-management-255c.vercel.app/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((users) => {
        const assigneeDropdown = document.getElementById("assigneeId");
        assigneeDropdown.innerHTML = "";
        users.forEach((user) => {
          const option = document.createElement("option");
          option.value = user._id;
          option.textContent = user.username;
          assigneeDropdown.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }
  function assignTask() {
    const taskId = document.getElementById("taskId").value;
    const assigneeId = document.getElementById("assigneeId").value;
    const allocatedBy = localStorage.getItem("email");
    // console.log("this is task id ",assigneeId)
    const taskData = {
      task_id: taskId,
      assignee_id: assigneeId,
      allocated_by: allocatedBy,
    };
  
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch("https://project-management-255c.vercel.app/api/tasks/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Task assigned successfully, notification sent") {
          alert("Task assigned successfully");
        } else {
          console.error("Error assigning task:", data.message);
        }
      })
      .catch((error) => console.error("Error assigning task:", error));
  }
  function addTask() {
    const taskInput = document.getElementById("taskInput").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const dueDate = document.getElementById("dueDate").value;
    const taskStatus = document.getElementById("taskStatus").value;
    const projectId = document.getElementById("projectDropdown").value;
  
    console.log("this is task data ", taskInput);
    const taskData = {
      title: taskInput,
      description: projectDescription,
      status: taskStatus,
      due_date: dueDate,
      created_by: localStorage.getItem("email"), // Assume user ID is stored in localStorage
      project_id: projectId,
    };
  
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch("https://project-management-255c.vercel.app/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Task added successfully") {
          alert("Task added successfully");
          fetchTasks();
        } else {
          console.error("Error adding task:", data.message);
        }
      })
      .catch((error) => console.error("Error adding task:", error));
  }
  
  function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("project_id");
  }
  
  function populateTaskDropdown(tasks) {
    const taskDropdown = document.getElementById("taskId");
    taskDropdown.innerHTML = ""; // Clear previous options
  
    tasks.forEach((task) => {
      const option = document.createElement("option");
      option.value = task._id; // Use the task ID as value
      option.textContent = task.title; // Display task title
      taskDropdown.appendChild(option);
    });
  }
  