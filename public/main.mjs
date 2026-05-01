import { formatDate, hexToRgba, rgbToHex } from "./helper.mjs";
import {
  saveCompletionsToServer,
  grabCompletionsFromServer,
  grabTasksFromServer,
  updateTaskToServer,
} from "./backendHelper.mjs";
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const dayHeaders = document.querySelector(".days-header");
const settingTemplate = document.querySelector("#setting-tempate");
const settingContainer = document.querySelector(".setting-container");
// New task modal
const taskModal = document.getElementById("myNewModal");
const taskModalCloseBtn = taskModal.querySelector(".close");
const taskModalCloseBtn2 = taskModal.querySelector(".modal-close-btn");
const addTaskBtn = taskModal.querySelector(".add-task-btn");
const taskInput = taskModal.querySelector(".input-task");

// edit task modal
const editModal = document.getElementById("myEditModal");
const editModalCloseBtn = editModal.querySelector(".close");
const editModalCloseBtn2 = editModal.querySelector(".modal-close-btn");
const editTaskBtn = editModal.querySelector(".edit-task-btn");
const editTaskInput = editModal.querySelector(".input-task");
const deleteTaskBtn = editModal.querySelector("#edit-task-delete-button");

const leftBtn = document.querySelector("#left-btn");
const rightBtn = document.querySelector("#right-btn");

// Habit counts
const totalHabitCount = document.querySelector("#total-habit-count");
// statbox
const statBox = document.querySelector(".stat-box");

// habit container header and body
const habitContainerHeader = document.querySelector(".habit-container-header");
const hideButtonContainer = document.querySelector(".hide-button-container");

// This is our global date probably should be all caps
let DATE = new Date();
let dateRange = 21; // 14 days
let currentEditedTask = null;
let TOTALCOUNT = 0;
let USERNAME = "abdalla";

const colors = [
  "#249c03",
  "#249cff",
  "#ffa503",
  "#ff0000",
  "#a64ca6",
  "#888888",
  "#329999",
];

let tasks = [
  {
    id: 1,
    name: "Walk the dog",
    color: colors[0],
    position: 0,
    totalCount: 0,
    longestStreak: 0,
    currentStreak: 0,
  },
  {
    id: 2,
    name: "Read 10 pages",
    color: colors[1],
    position: 1,
    totalCount: 0,
    longestStreak: 0,
    currentStreak: 0,
  },
];

const completions = {
  "2026-04-16": [1], // Task 1 completed today
  "2026-04-15": [1, 2], // Both completed yesterday
};

if (USERNAME) {
  let taskDb = await grabTasksFromServer(USERNAME);
  if (taskDb) {
    tasks = [...taskDb];
  } else {
    if (localStorage.getItem("tasks")) {
      tasks = [...JSON.parse(localStorage.getItem("tasks"))];
    } else {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
} else {
  if (localStorage.getItem("tasks")) {
    tasks = [...JSON.parse(localStorage.getItem("tasks"))];
  } else {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// username should be a replacement for if signed in check
const savedData = localStorage.getItem("completions");
if (USERNAME) {
  let completionDb = await grabCompletionsFromServer(USERNAME);
  if (completionDb) {
    Object.assign(completions, completionDb);
    console.log("grabbed from server");
  } else {
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.assign(completions, parsedData);
    } else {
      localStorage.setItem("completions", JSON.stringify(completions));
    }
  }
} else {
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    Object.assign(completions, parsedData);
  } else {
    localStorage.setItem("completions", JSON.stringify(completions));
  }
}

function calculateCompletions(date) {
  if (date === "all") {
    TOTALCOUNT = Object.values(completions).reduce((acc, val) => {
      return acc + val.length;
    }, 0);
  } else {
    return completions[date] ? completions[date].length : 0;
  }
}

function setWeekendElement(date, element) {
  if (date.getDay() % 6 == 0) {
    element.classList.add("weekend");
  }
}

function renderCalendar(day = DATE) {
  settingContainer.textContent = "";
  calendarDays.textContent = "";
  dayHeaders.textContent = "";
  statBox.textContent = "";
  hideButtonContainer.innerHTML = "";
  dateRange = getDesiredDateRange();
  calculateCompletions("all");
  totalHabitCount.innerText = TOTALCOUNT;
  monthYear.innerText = DATE.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  createHideSettingButton();
  // Create day header header
  for (let i = dateRange - 1; i >= 0; i--) {
    const dayHeaderContainer = document.createElement("div");
    dayHeaderContainer.classList.add("day-header-container");

    let currentDay = day.getDate() - i;
    let targetDate = new Date(day.getFullYear(), day.getMonth(), currentDay);

    let dayOfWeek = targetDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    let dateOfMonth = targetDate.getDate();
    let monthName = targetDate.toLocaleDateString("en-US", { month: "short" });

    dayHeaderContainer.innerHTML = `<p>${monthName}</p> <p><b>${dateOfMonth}</b></p> <p>${dayOfWeek}</p>`;
    setWeekendElement(targetDate, dayHeaderContainer);
    if (i == 0) {
      dayHeaderContainer.classList.add("current-day");
    }
    dayHeaders.appendChild(dayHeaderContainer);
  }

  //create Task divs
  tasks.forEach((task) => {
    const gridRow = document.createElement("div");

    gridRow.classList.add("grid-row");
    for (let i = dateRange - 1; i >= 0; i--) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("task");
      dayDiv.dataset.id = task.id;
      dayDiv.dataset.index = i;
      dayDiv.style.setProperty("--task-color", task.color);
      let currentDay = day.getDate() - i;
      let targetDate = new Date(day.getFullYear(), day.getMonth(), currentDay);
      dayDiv.dataset.date = formatDate(targetDate);
      dayDiv.innerText = task.name;
      dayDiv.style.color = "#ccc";
      setWeekendElement(targetDate, dayDiv);
      if (isCompleted(dayDiv.dataset.date, task.id)) {
        dayDiv.classList.add("is-completed");
        dayDiv.innerText = task.name;
        let opacity = (i / (dateRange - 1) + 0.15).toFixed(1);
        let dynamicColor = hexToRgba(task.color, opacity);
        dayDiv.style.setProperty("--task-opacity", opacity);
        dayDiv.style.backgroundColor = dynamicColor;
        dayDiv.style.border = `1px solid ${hexToRgba(task.color, 1)}`;
        dayDiv.style.height = "3rem";
        dayDiv.style.width = "5rem";
        dayDiv.innerText = "Skip";
        dayDiv.style.transition = "background-color 0.2s, transform 0.1s";
      }
      if (i == 0) {
        dayDiv.classList.add("current-day");
      }
      gridRow.dataset.id = task.id;
      gridRow.appendChild(dayDiv);
    }
    calendarDays.appendChild(gridRow);

    createStats(task, day);
    createSettingButtons(task);
  });

  addHideBtnEventListener();
  // daily count
  const gridRow = document.createElement("div");
  gridRow.classList.add("grid-row");
  gridRow.classList.add("count-row");
  for (let i = dateRange - 1; i >= 0; i--) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("daily-count");
    dayDiv.style.height = "3rem";
    dayDiv.style.width = "5rem";
    let currentDay = day.getDate() - i;
    let targetDate = new Date(day.getFullYear(), day.getMonth(), currentDay);
    dayDiv.dataset.date = formatDate(targetDate);
    let dailyCount = completions[formatDate(targetDate)]?.length || 0;
    dayDiv.innerText = dailyCount;
    dayDiv.dataset.count = dailyCount;
    if (dailyCount == tasks.length) {
      dayDiv.innerHTML = `<i class="fa-solid fa-star" style="color: rgb(255, 212, 59);"></i><span> ${dailyCount}</span>`;
    }
    if (i == 0) {
      dayDiv.classList.add("current-day");
    }
    gridRow.appendChild(dayDiv);
  }
  calendarDays.appendChild(gridRow);

  const addTaskBtn = document.createElement("button");
  addTaskBtn.classList.add("add-task-btn");
  addTaskBtn.innerHTML = `<i class="fa-solid fa-plus"></i><span>New Habit</span>`;
  addTaskBtn.addEventListener("click", () => {
    taskModal.style.display = "block";
  });

  settingContainer.appendChild(addTaskBtn);
}
function createHideSettingButton() {
  let hideBtn = document.createElement("button");
  hideBtn.id = "hide-setting-btn";
  hideBtn.innerHTML = `<i class="fa-solid fa-sliders"></i>`;
  hideButtonContainer.appendChild(hideBtn);
}

function addHideBtnEventListener() {
  let hideBtn = document.getElementById("hide-setting-btn");
  let settingRow = settingContainer.querySelectorAll(".setting-task-container");
  let ghostContainer = document.querySelector(".ghost-container");
  hideBtn.addEventListener("click", () => {
    settingRow.forEach((row) => row.classList.toggle("hide-buttons"));
    ghostContainer.classList.toggle("hide-buttons");
  });
}

function statHelper(task) {
  let streak = 0;
  let longestStreak = 0;
  let totalCount = 0;

  let previousDate = null;
  const sortedCompletions = Object.entries(completions).sort((a, b) => {
    // Use (new Date(a[0]) - new Date(b[0])) for Oldest -> Newest
    // return new Date(b[0]) - new Date(a[0]); // Newest -> Oldest
    return a[0].localeCompare(b[0]); // Much faster performance than creating Date objects
  });

  sortedCompletions.forEach((key) => {
    const safeDateObject = new Date(key[0].replace(/-/g, "/")); // thu apr 17 2026
    let nextExpectedDay;
    if (previousDate) {
      nextExpectedDay = new Date(previousDate);
      nextExpectedDay.setDate(nextExpectedDay.getDate() + 1);
    }
    if (previousDate == null && key[1].includes(Number(task.id))) {
      streak++;
    } else if (
      previousDate &&
      nextExpectedDay.getTime() === safeDateObject.getTime() &&
      key[1].includes(Number(task.id))
    ) {
      streak++;
    } else {
      streak = key[1].includes(Number(task.id)) ? 1 : 0;
    }
    previousDate = safeDateObject;
    longestStreak = Math.max(streak, longestStreak);
  });

  task.longestStreak = longestStreak;
  Object.values(completions).forEach((date) => {
    if (date.includes(task.id)) {
      totalCount++;
    }
  });

  return [task.longestStreak, streak, totalCount];
}

function createStats(task) {
  let totalCount = 0;

  let streak = 0;

  [task.longestStreak, streak, totalCount] = statHelper(task);
  task.totalCount = totalCount;
  task.streak = streak;

  let statsRow = document.createElement("div");
  statsRow.classList.add("row");
  let stat1 = document.createElement("div");
  stat1.classList.add("stat-1");

  let stat2 = document.createElement("div");
  stat2.classList.add("stat-2");

  let stat3 = document.createElement("div");
  stat3.classList.add("stat-3");

  stat1.innerText = streak;
  stat2.innerText = task.longestStreak;
  stat3.innerText = totalCount;
  statsRow.dataset.id = task.id;
  statsRow.appendChild(stat1);
  statsRow.appendChild(stat2);
  statsRow.appendChild(stat3);

  Array.from(statsRow.children).forEach((stat) => {
    stat.classList.add("stats-box-container");
  });

  statBox.appendChild(statsRow);
}
function updateStats(task, stat) {
  if (stat == "neg") {
    task.totalCount -= 1;
  } else {
    task.totalCount += 1;
  }
  let totalCount = 0;
  let streak = 0;
  [task.longestStreak, streak, totalCount] = statHelper(task);
  task.streak = streak;
  let statArray = [task.streak, task.longestStreak, task.totalCount];
  let statsRow = statBox.querySelector(`[data-id="${task.id}"]`);
  Array.from(statsRow.children).forEach((stat, index) => {
    stat.innerText = "";
    stat.innerText = statArray[index];
  });
}
function isCompleted(date, taskId) {
  // Format the date to match your storage key (e.g., "2026-04-16")
  // const dateKey = formatDate(dateObj);
  return completions[date]?.includes(taskId) || false;
}

calendarDays.addEventListener("click", async (event) => {
  const taskDiv = event.target.closest(".task");
  let id = Number(taskDiv.dataset.id);
  let currDate = taskDiv.dataset.date;
  let index = Number(taskDiv.dataset.index);

  // find daily count and update
  let countRow = document.querySelector(".count-row");
  let countDiv = countRow.querySelector(
    '.daily-count[data-date="' + currDate + '"]',
  );

  let task = tasks.find((task) => task.id == id);
  if (isCompleted(currDate, id)) {
    // Remove dialy habit task
    taskDiv.classList.remove("is-completed");
    taskDiv.style.backgroundColor = "#fff";
    taskDiv.style.border = "1px solid #eee";
    taskDiv.innerText = task.name;
    // update daily count
    countDiv.dataset.count = Number(countDiv.dataset.count) - 1;
    countDiv.innerText = countDiv.dataset.count;
    // updateTotal Count =
    totalHabitCount.innerText = TOTALCOUNT - 1;
    // update completions and save to local
    completions[currDate] = completions[currDate].filter((item) => item != id);
    if (completions[currDate].length === 0) {
      delete completions[currDate];
    }
    // update weekly stats
    updateStats(task, DATE, "neg");
    localStorage.setItem("completions", JSON.stringify(completions));
    await saveCompletionsToServer(USERNAME, completions);
  } else {
    // Add daily habit task
    taskDiv.classList.add("is-completed");
    let opacity = (index / (dateRange - 1) + 0.15).toFixed(1);
    let dynamicColor = hexToRgba(task.color, opacity);
    taskDiv.style.backgroundColor = dynamicColor;
    taskDiv.style.border = `1px solid ${hexToRgba(task.color, 1)}`;
    taskDiv.innerText = "Skip";
    //update daily count
    countDiv.dataset.count = Number(countDiv.dataset.count) + 1;
    countDiv.innerText = countDiv.dataset.count;
    // updateTotal Count =
    totalHabitCount.innerText = TOTALCOUNT + 1;
    // update completions and save to local
    completions[currDate] == undefined
      ? (completions[currDate] = [id])
      : completions[currDate]?.push(id);
    // update weekly stats
    updateStats(task, DATE, "pos");
    localStorage.setItem("completions", JSON.stringify(completions));
    saveCompletionsToServer("abdalla", completions);
  }
});

// Setting buttons
function createSettingButtons(task) {
  const clone = settingTemplate.content.cloneNode(true);

  let buttons = clone.querySelectorAll("button");
  let opacity = 1;
  buttons.forEach((el) => {
    if (el.classList.contains("popup")) {
      // const colorBtns = el.querySelectorAll(".popup-colors");
      el.addEventListener("click", (e) => openColorPopup(e, task));
      el.addEventListener("click", async (e) => {
        if (e.target.classList.contains("popup-colors")) {
          let color = e.target.style.backgroundColor;
          task.color = rgbToHex(color);
          renderCalendar();
          localStorage.setItem("tasks", JSON.stringify(tasks));
          await updateTaskToServer(USERNAME, tasks);
        }
      });
    }
    if (el.classList.contains("edit-task")) {
      el.addEventListener("click", () => {
        currentEditedTask = task.id;
        editModal.style.display = "block";
        editTaskInput.value = task.name;
      });
    }
    if (el.classList.contains("drag")) {
      const settingTaskContainer = el.closest(".setting-task-container");
      settingTaskContainer.dataset.id = task.id;

      const gridRow = calendarDays.querySelector(`[data-id="${task.id}"]`);
      const statRow = statBox.querySelector(`[data-id="${task.id}"]`);
      el.addEventListener("dragstart", () => {
        settingTaskContainer.classList.add("dragging");
        if (gridRow) gridRow.classList.add("dragging");
        if (statRow) statRow.classList.add("dragging");
      });

      el.addEventListener("dragend", async () => {
        document
          .querySelectorAll(".dragging")
          .forEach((item) => item.classList.remove("dragging"));

        calendarDays
          .querySelectorAll(".grid-row")
          .forEach((taskElement, index) => {
            // Find the original task object
            const taskObj = tasks.find((t) => t.id == taskElement.dataset.id);
            if (taskObj) {
              taskObj.position = index;
            }
          });

        let statBox = document.querySelector(".stat-box");
        statBox.querySelectorAll(".row").forEach((row, index) => {
          const taskRow = tasks.find((t) => t.id == row.dataset.id);
          if (taskRow) {
            taskRow.position = index;
          }
        });

        tasks.sort((a, b) => a.position - b.position);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        await updateTaskToServer(USERNAME, tasks);
      });
    }
    el.style.backgroundColor = hexToRgba(task.color, opacity);
    el.style.border = `1px solid ${hexToRgba(task.color, opacity)}`;
    opacity = opacity - 0.25;
  });
  let p = clone.querySelector("p");
  p.innerText = task.name;
  p.style.backgroundColor = "white";
  p.style.border = `1px solid #eee`;
  p.style.borderRight = "0px";

  settingContainer.appendChild(clone);
}

taskModalCloseBtn.onclick = function () {
  taskInput.value = "";
  taskModal.style.display = "none";
};
taskModalCloseBtn2.onclick = function () {
  taskInput.value = "";
  taskModal.style.display = "none";
};
editModalCloseBtn.onclick = function () {
  editTaskInput.value = "";
  editModal.style.display = "none";
};
editModalCloseBtn2.onclick = function () {
  editTaskInput.value = "";
  editModal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == taskModal) {
    taskInput.value = "";
    taskModal.style.display = "none";
  }
  if (event.target == editModal) {
    editTaskInput.value = "";
    editModal.style.display = "none";
  }
};

addTaskBtn.addEventListener("click", async () => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  if (taskInput.value != "") {
    tasks.push({
      id: tasks.length + 1,
      name: taskInput.value,
      color: randomColor,
      position: tasks.length + 1,
      totalCount: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    await updateTaskToServer(USERNAME, tasks);
  }
  taskInput.value = "";
  taskModal.style.display = "none";
  renderCalendar();
});
editTaskBtn.addEventListener("click", async () => {
  let currentTask = tasks.find((task) => task.id == currentEditedTask);
  if (currentTask != undefined) {
    currentTask.name = editTaskInput.value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    await updateTaskToServer(USERNAME, tasks);
  }
  editTaskInput.value = "";
  editModal.style.display = "none";
  renderCalendar();
});

leftBtn.addEventListener("click", () => {
  DATE.setDate(DATE.getDate() - dateRange);
  renderCalendar(DATE);
});
rightBtn.addEventListener("click", () => {
  DATE.setDate(DATE.getDate() + dateRange);
  renderCalendar(DATE);
});

deleteTaskBtn.addEventListener("click", async () => {
  let response = confirm("Delete this task?, This will ");
  // currentEditedTask is our current task's id
  if (response) {
    Object.values(completions).forEach((key) => {
      key = key.filter((id) => id != currentEditedTask);
    });
    tasks = tasks.filter((task) => task.id != currentEditedTask);
    editTaskInput.value = "";
    editModal.style.display = "none";
    renderCalendar();

    localStorage.setItem("tasks", JSON.stringify(tasks));
    await updateTaskToServer(USERNAME, tasks);
    localStorage.setItem("completions", JSON.stringify(completions));
    await saveCompletionsToServer(USERNAME, completions);
  }
});

function openColorPopup(e) {
  e.stopPropagation();
  let popup = e.currentTarget.querySelector(".popuptext");
  document.querySelectorAll(".popuptext.show").forEach((p) => {
    if (p !== popup) p.classList.remove("show");
  });
  popup.classList.toggle("show");

  const closePopup = (event) => {
    if (!popup.contains(event.target)) {
      popup.classList.remove("show");
      window.removeEventListener("click", closePopup);
    }
  };
  window.addEventListener("click", closePopup);
}
function getDesiredDateRange() {
  // if (window.innerWidth < 1912) {
  if (window.innerWidth < 768) return 1;

  // screen size 416 is our left side container and 192 is our right side container
  // let's -80 + -20 for padding,  since our last container is twice as big
  return Math.floor((window.innerWidth - 416 - 192 - 100) / 80);
  // }
  // return (window.innerWidth - 416 - 192) / 80; //
}
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderCalendar();
  }, 250); // Wait 250ms after resizing stops
});

// Drag n Drop
settingContainer.addEventListener("dragenter", (e) => {
  e.preventDefault();
});

settingContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const draggableBtn = settingContainer.querySelector(".dragging");
  const draggableRow = calendarDays.querySelector(".dragging");
  const draggableStatRow = statBox.querySelector(".dragging");
  // console.log(draggableStatRow);
  const newHabitBtn = settingContainer.querySelector(".add-task-btn");

  if (!draggableBtn || !draggableRow) return;
  let siblings = [
    ...settingContainer.querySelectorAll(
      ".setting-task-container:not(.dragging)",
    ),
  ];
  // console.log(siblings);

  let nextSibling = siblings.find((sibling) => {
    return e.clientY < sibling.offsetTop + sibling.offsetHeight / 2;
  });

  // console.log(nextSibling);
  if (!nextSibling) settingContainer.insertBefore(draggableBtn, newHabitBtn);
  else settingContainer.insertBefore(draggableBtn, nextSibling);

  const nextRow = nextSibling
    ? calendarDays.querySelector(`[data-id="${nextSibling.dataset.id}"]`)
    : calendarDays.lastElementChild;

  calendarDays.insertBefore(draggableRow, nextRow);

  const nextStatRow = nextSibling
    ? statBox.querySelector(`[data-id="${nextSibling.dataset.id}"]`)
    : null;
  statBox.insertBefore(draggableStatRow, nextStatRow);
});

// Main function
renderCalendar();
