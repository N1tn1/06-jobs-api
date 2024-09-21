import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTasks } from "./tasks.js";

let addEditDiv = null;
let title = null;
let description = null;
let priority = null;
let dueDate = null;
let status = null;
let addingTask = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-task");
    title = document.getElementById("title");
    description = document.getElementById("description");
    priority = document.getElementById("priority");
    dueDate = document.getElementById("dueDate");
    status = document.getElementById("status");
    addingTask = document.getElementById("adding-task");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingTask) {
                enableInput(false);
                let method = "POST";
                let url = "/api/tasks";

                if(addingTask.textContent === "update") {
                    method = "PATCH";
                    url = `/api/tasks/${addEditDiv.dataset.id}`;
                }
                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "applicaiton/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            title: title.value,
                            description: description.value,
                            priority: priority.value,
                            dueDate: dueDate.value,
                            status: status.value,
                        }),
                    });
                    const data = await response.json();
                    if(response.status === 200 || response.status === 201) {
                        if(response.status === 200) {
                            message.textContent = "The task entry was updated.";
                        }
                        else {
                            message.textContent = "The task entry was created.";
                        }
                        
                        title.value = "";
                        description.value = "";
                        priority.value = "";
                        dueDate.value = "";
                        status.value = "pending";

                        showTasks();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.log(err);
                    message.textContent = "A Communication error occurred.";
                }
                enableInput(true);
            } else if(e.target === editCancel) {
                message.textContent = "";
                showTasks();
            }
        }
    })
}

export const showAddEdit = async (taskId) => {
    if (!taskId) {
        title.value = "";
        description.value = "";
        priority.value = "high";
        dueDate.value = "";
        status.value = "pending";
        addingJob.textContent = "add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if(response.status === 200) {
                title.value = data.task.title;
                description.value = data.task.description;
                priority.value = data.task.priority;
                dueDate.value = data.task.dueDate;
                status.value = data.task.status;
                addingTask.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = taskId;

                setDiv(addEditDiv);
            } else {
                message.textContent = "The tasks entry was not found";
                showTasks();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";

            showTasks();
        }
        enableInput(true);
    }
};