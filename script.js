let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function addTasks(event) {
    event.preventDefault()
    const taskInput = document.getElementById("taskInput")
    const taskText = taskInput.value.trim()

    if (taskText) {
        tasks.push({
            text: taskText,
            completed: false
        })
    }

    taskInput.value = "";
    saveTask()
    taskRender();

}
// Search Section

let searchText = ''
let currentFilter = 'All'

function taskRender() {
    const taskList = document.getElementById("taskList")
    taskList.innerHTML = ""
    const filterTasks = tasks
        .filter(task => task.text.toLowerCase().includes(searchText.toLowerCase()))
        .filter(task => {
            if (currentFilter === 'Completed') return task.completed
            if (currentFilter === 'Pending') return !task.completed
            return true;
        })
    if (filterTasks.length === 0) {
        taskList.innerHTML = "<li>No matching task found</li>"
    }

    filterTasks.forEach((task, index) => {
        const list = document.createElement("li")
        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = task.completed ? "line-through" : "none";
        }
        list.appendChild(span);
        
        // Mark complete
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.completed
        checkBox.onchange = () => toggleTask(index)
        list.appendChild(checkBox)
        taskList.appendChild(list)

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            // Replace span with input
            const input = document.createElement("input");
            input.type = "text";
            input.value = task.text;

            list.replaceChild(input, span);
            editButton.textContent = "Save";

            editButton.onclick = () => {
                task.text = input.value.trim() || task.text;
                saveTask();
                taskRender();
            };
        });
        list.appendChild(editButton);

        taskList.appendChild(list);
        // Delete Task
        const deleteBtn = document.createElement("Button")
        deleteBtn.innerText = "Delete"

        deleteBtn.addEventListener("click", () => deleteTask(index));
        list.appendChild(deleteBtn)
    });

    renderStats();
}

function renderStats() {
    const stats = document.getElementById("stats");
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    stats.textContent = `Total Tasks: ${totalTasks} | completed: ${completedTasks} |  pending: ${pendingTasks}`;

}
function deleteTask(index) {
    tasks = tasks.filter((_, i) => i !== index)
    saveTask()
    taskRender()
}
function toggleTask(index) {
    tasks = tasks.map((task, i) =>
        i === index
            ? { ...task, completed: !task.completed }
            : task
    );
    // tasks[index].completed = !tasks[index].completed;
    saveTask()
    taskRender()
}

// Save Task

function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
document.addEventListener("DOMContentLoaded", taskRender);

// search input
document.getElementById("searchInput").addEventListener("input", (e) => {
    searchText = e.target.value
    taskRender()
})
// filter button

document.querySelectorAll("button[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.getAttribute("data-filter");
        taskRender()
    })
})
// Dark Mode
document.getElementById("dark-mode-btn").addEventListener("click", () =>{
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
})
// restore dark mode on page
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}
// Fetch sample tasks
document.getElementById("load-sample-btn").addEventListener("click", async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const data = await res.json();
    const fetchedTasks = data.map(t => ({ text: t.title, completed: t.completed }));
    tasks = [...tasks, ...fetchedTasks];
    saveTask();
    taskRender();
});

// Initial render
document.addEventListener("DOMContentLoaded", taskRender);

