let activeDiv = null;
const LOCAL_STORAGE_TOKEN_KEY = "token";

export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, value);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }
};

export let message = null;

import { showTasks, handleTasks } from "./tasks.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

const init = () => {
  token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  message = document.getElementById("message");

  handleLoginRegister();
  handleLogin();
  handleTasks();
  handleRegister();
  handleAddEdit();

  if (token) {
    showTasks();
  } else {
    showLoginRegister();
  }
};

document.addEventListener("DOMContentLoaded", init);