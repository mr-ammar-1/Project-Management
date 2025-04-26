document.addEventListener("DOMContentLoaded", () => {
  usernameField = document.getElementById("username");
  emailField = document.getElementById("email");
  updateStatus = document.getElementById("updateStatus");

  fetchUser();
  
});

let userId = "";

function fetchUser() {
  //   const usernameField = document.getElementById("username");
  //   const emailField = document.getElementById("email");
  //   const updateStatus = document.getElementById("updateStatus");

  const email = localStorage.getItem("email");
  //   const password = localStorage.getItem("password");

  // Fetch user data and prefill form
  fetch(`http://localhost:3000/api/users/getUserByEmail/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    })
    .then((user) => {
      // alert(user._id)
      userId = user._id;
      usernameField.value = user.username;
      emailField.value = user.email;

      fetchTasksByUser();
    })
    .catch((error) => {
      console.error("Error loading profile:", error);
      updateStatus.textContent = "Failed to load profile information.";
      updateStatus.style.color = "red";
    });
  // .catch((error) => console.error("Error fetching tasks:", error));
}

// Save changes (you can add API update logic here if needed)
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();

  //   alert("The user id is" + userId)

  const updatedUsername = usernameField.value.trim();
  const updatedEmail = emailField.value.trim();

  fetch(`http://localhost:3000/api/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      username: updatedUsername,
      email: updatedEmail,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update user details");
      return res.json();
    })
    .then(() => {
      //   document.getElementById("editModal").style.display = "none";
      // localStorage.setItem('username', updatedUsername)
      localStorage.setItem("email", updatedEmail);
      fetchUser(); // Refresh task list
    })
    .catch((err) => console.error("Error updating task:", err));

  alert("User updatd successfully.");

  // Optional: Make a PUT/PATCH API call here to update user
  updateStatus.textContent = "Changes saved (mocked update)";
  updateStatus.style.color = "green";
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

function fetchTasksByUser() {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

//   alert(userId)

  fetch(`http://localhost:3000/api/tasks/getTasksByUser/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      email: email,
      password: password,
    },
  })
    .then((response) => response.json())
    .then((tasks) => {
      const taskTableBody = document.getElementById("taskTableBody");
      taskTableBody.innerHTML = "";

      console.log("The tasks are: " , tasks)
      tasks.forEach((task) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td style="padding: 10px 4px">${task.title}</td>
                <td style="padding: 10px 4px">${task.status}</td>
                <td style="padding: 10px 4px">
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
                <td style="padding: 10px 4px">${task.repeats}</td>
            `;

        taskTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}
