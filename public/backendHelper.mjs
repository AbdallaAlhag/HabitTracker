async function saveCompletionsToServer(username, obj) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/v1/habits/updateCompletion",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, completion: obj }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }

    // If success, you can choose to return the data or just true
    // return await response.json();
    let responseJson = await response.json();
    console.log(responseJson.message);
    return true;
  } catch (error) {
    console.error("Saving completions failed:", error.message);
    return null;
  }
}

async function grabCompletionsFromServer(username) {
  try {
    // 1. Convert the username into a query string
    const params = new URLSearchParams({ username });
    const url = `http://localhost:4000/api/v1/habits/getCompletion?${params}`;

    // 2. Fetch using GET with NO body
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to grab completions");
    }

    const responseJson = await response.json();
    console.log("Data from server:", responseJson);

    // Return the specific field your frontend needs
    return responseJson.completions;
  } catch (error) {
    console.error("Grabbing completions failed:", error.message);
    return null;
  }
}

async function grabTasksFromServer(username) {
  try {
    // 1. Convert the username into a query string
    const params = new URLSearchParams({ username });
    const url = `http://localhost:4000/api/v1/habits/getTask?${params}`;

    // 2. Fetch using GET with NO body
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to grab tasks");
    }

    const responseJson = await response.json();
    console.log("Data from server:", responseJson.message);

    // Return the specific field your frontend needs
    return responseJson.tasks;
  } catch (error) {
    console.error("Grabbing tasks failed:", error.message);
    return null;
  }
}
async function updateTaskToServer(username, task) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/v1/habits/updateTask",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          task,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }

    // If success, you can choose to return the data or just true
    // return await response.json();
    let responseJson = await response.json();
    console.log(responseJson.message);
    return true;
  } catch (error) {
    console.error("Updating task failed:", error.message);
    return null;
  }
}
export {
  saveCompletionsToServer,
  grabCompletionsFromServer,
  grabTasksFromServer,
  updateTaskToServer,
};
