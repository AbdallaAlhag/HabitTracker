import { User } from "../models/User.model.js";

// honesty this is kinda useless lol
const findId = async (username) =>
  await User.findOne({ username }).select("_id");

// Create task
const createTask = async (req, res) => {
  try {
    const { username, id, name, color, position } = req.body;
    // although i doubt this will reall matter
    if (!name || !username) {
      return res.status(400).json({
        message: "Missing name and color fields",
      });
    }
    const userDoc = await findId(username);
    const userId = userDoc?._id;
    if (!userId) {
      return res.status(400).json({
        message: "Can't find user Id",
      });
    }

    const task = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          tasks: {
            id,
            name,
            color,
            position,
            totalCount: 0,
            longestStreak: 0,
            currentStreak: 0,
          },
        },
      },
      { new: true },
    );

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all task
const getAllTask = async (req, res) => {
  try {
    const { username } = req.body;
    // although i doubt this will reall matter
    if (!username) {
      return res.status(400).json({
        message: "Missing Account",
      });
    }
    const userDoc = await findId(username);
    const userId = userDoc?._id;
    if (!userId) {
      return res.status(400).json({
        message: "Can't find user Id",
      });
    }

    let allTask = await User.findById(userId).select({
      tasks: 1,
      _id: 0,
    });
    allTask = allTask.tasks;
    res
      .status(201)
      .json({ message: "All tasks have been sucessfully found", allTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const {
      username,
      name,
      id,
      color,
      position,
      totalCount,
      longestStreak,
      currentStreak,
    } = req.body;
    if (!username || !id) {
      return res.status(400).json({
        message: "Missing info",
      });
    }
    const userDoc = await findId(username);
    const userId = userDoc?._id;
    if (!userId) {
      return res.status(400).json({
        message: "Can't find user Id",
      });
    }

    const updatedTask = await User.findOneAndUpdate(
      {
        username: username, // Find the user by ID
        "tasks.id": id, // Find the task inside the array with this task id
      },
      {
        $set: {
          "tasks.$.id": id,
          "tasks.$.name": name,
          "tasks.$.color": color,
          "tasks.$.position": position,
          "tasks.$.totalCount": totalCount,
          "tasks.$.longestStreak": longestStreak,
          "tasks.$.currentStreak": currentStreak,
          // Only include the fields you actually want to change
        },
      },
      { new: true }, // Returns the document after the update
    );
    res
      .status(201)
      .json({ message: "Tasks have been sucessfully Updated", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { username, name, id } = req.body;
    if (!username || !id || !name) {
      return res.status(400).json({
        message: "Missing info",
      });
    }
    const userDoc = await findId(username);
    const userId = userDoc?._id;
    if (!userId) {
      return res.status(400).json({
        message: "Can't find user Id",
      });
    }

    const updatedTask = await User.findOneAndUpdate(
      {
        username: username, // Find the user by ID
        "tasks.id": id, // Find the task inside the array with this task id
      },
      {
        $pull: {
          tasks: { id: id, name: name }, // 2. Remove task where id matches taskId
        },
      },
      { new: true }, // Returns the document after the update
    );
    res
      .status(201)
      .json({ message: "Tasks have been sucessfully Deleted", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export { createTask, getAllTask, updateTask, deleteTask };
