document.addEventListener("DOMContentLoaded", () => {
    fetchProjects();
    fetchAllProjects();
    fetchCollaborationProjects();
    // fetchUserProjects();
});

async function addCollaborator() {
const projectId = document.getElementById('collaboratorProjectDropdown').value;
const email = document.getElementById('collaboratorEmail').value;
const userEmail = localStorage.getItem("email");
const userPassword = localStorage.getItem("password");

if (!email) {
alert("Please enter collaborator's email.");
return;
}

try {
const response = await fetch(`http://localhost:3000/api/projects/${projectId}/collaborators`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        email: userEmail,
        password: userPassword
    },
    body: JSON.stringify({ email })
});

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
}

alert('Collaborator invited successfully!');
} catch (error) {
console.error('Error inviting collaborator:', error);
alert('Failed to invite collaborator: ' + error.message);
}
}


async function fetchProjects() {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    const response = await fetch("http://localhost:3000/api/projectsDisplay/userfromprojects", {
        method: "GET",
        headers: {
        
            email: email,
            password: password,
            userId: userId // Pass the userId in headers
        }
    });

    const data = await response.json();
    console.log("Raw response from backend:", data);

    // Normalize to array
    const projects = Array.isArray(data) ? data : [data];

    if (!Array.isArray(projects)) {
        throw new Error("Invalid data format received");
    }

    const projectContainer = document.getElementById("projectContainer");
    projectContainer.innerHTML = "";

    projects.forEach(project => {
        const li = document.createElement("li");
        li.innerHTML = `${project.name} <span class="status">${project.status}</span>
            <button onclick="deleteProject('${project._id}')">Delete</button>`;
        projectContainer.appendChild(li);
    });
}


async function fetchAllProjects() {

    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    const response = await fetch("http://localhost:3000/api/projectsDisplay/userfromprojects", {
        method: "GET",
        headers: {
        
            email: email,
            password: password,
            userId: userId // Pass the userId in headers
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

async function fetchCollaborationProjects() {

    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    const response = await fetch("http://localhost:3000/api/projectsDisplay/userfromprojects", {
        method: "GET",
        headers: {
        
            email: email,
            password: password,
            userId: userId // Pass the userId in headers
        }
    })
.then(response => response.json())
.then(projects => {

const collaboratorProjectDropdown = document.getElementById('collaboratorProjectDropdown');
collaboratorProjectDropdown.innerHTML = '';
projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project._id;
    option.textContent = project.name;
    collaboratorProjectDropdown.appendChild(option);


});

})
.catch(error => console.error('Error fetching projects:', error));
}




async function generateReport() {
const projectId = document.getElementById('projectDropdown').value;
const email = localStorage.getItem("email");
const password = localStorage.getItem("password");

const reportContainer = document.getElementById('reportContent');
reportContainer.innerHTML = "<p>Generating report...</p>";

try {
const response = await fetch(`http://localhost:3000/api/reports/project/${projectId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        email: email,
        password: password
    }
});

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${response.status} - ${errorText}`);
}

const data = await response.json();

const report = `
    <p><strong>Total Tasks:</strong> ${data.totalTasks || 0}</p>
    <p><strong>To Do:</strong> ${data.statusCount?.todo || 0}</p>
    <p><strong>In Progress:</strong> ${data.statusCount?.in_progress || 0}</p>
    <p><strong>Completed:</strong> ${data.statusCount?.completed || 0}</p>
    <p><strong>Archived:</strong> ${data.statusCount?.archived || 0}</p>
    <p><strong>Overall Progress:</strong> ${data.avgProgress ?? 0}%</p>
`;

reportContainer.innerHTML = report;

} catch (error) {
console.error('Error generating report:', error);
reportContainer.innerHTML = `<p style="color:red;">Failed to generate report. ${error.message}</p>`;
}
}


async function addProject() {
    const name = document.getElementById("projectInput").value;
    const description = document.getElementById("projectDescription").value;
    const status = document.getElementById("projectStatus").value;
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const userId = localStorage.getItem("userId"); // Fetch the saved user ID

    if (!name || !description || !status) {
        alert("All fields are required!");
        return;
    }

    await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            email: email,
            password: password
        },
        body: JSON.stringify({ name, description, status, created_by: userId }) // Correct userId
    });

    alert('Project added successfully');
    fetchProjects();
}

async function fetchUserProjects() {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    const response = await fetch("http://localhost:3000/api/projects/user-projects", {
        method: "GET",
        headers: {
            "userId": userId,
           email:email,
           password:password
        }
    });

    const data = await response.json();
    // Now populate your UI using `data`
    console.log(data);
}


async function deleteProject(id) {
const email = localStorage.getItem("email");
const password = localStorage.getItem("password");

try {
const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
    method: "DELETE",
    headers: {
        email: email,
        password: password
    }
});

if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete project");
}

fetchProjects();
} catch (error) {
console.error("Error deleting project:", error.message);
alert("Error deleting project: " + error.message);
}
}