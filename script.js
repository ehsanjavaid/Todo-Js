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
        list.textContent = task.text

        if (task.completed) {
            list.style.textDecoration = task.completed ? "line-through" : "none";
        }
        // Delete Task
        const deleteBtn = document.createElement("Button")
        deleteBtn.innerText = "Delete"

        deleteBtn.addEventListener("click", () => deleteTask(index));
        list.appendChild(deleteBtn)
        // Mark complete
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.completed
        checkBox.onchange = () => toggleTask(index)
        list.appendChild(checkBox)
        taskList.appendChild(list)

    });
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



