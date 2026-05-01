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
    const { username } = req.query;
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

    let tasks = await User.findById(userId).select({
      tasks: 1,
      _id: 0,
    });
    tasks = tasks.tasks;
    res
      .status(201)
      .json({ message: "All tasks have been sucessfully found", tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { username, task } = req.body;
    if (!username) {
      return res.status(400).json({
        message: "Missing username",
      });
    }
    const updatedTask = await User.findOneAndUpdate(
      { username: username },
      { $set: { tasks: task } },
      { new: true },
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

// {"2026-04-16":[1],"2026-04-15":[1,2]}
const updateCompletion = async (req, res) => {
  try {
    const { username, completion } = req.body;
    if (!username) {
      return res.status(400).json({
        message: "Missing info",
      });
    }
    const complete = await User.findOneAndUpdate(
      { username: username },
      { $set: { completions: completion } },
      { new: true },
    );
    res.status(201).json({ message: "Completions object updated", complete });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
const getCompletion = async (req, res) => {
  try {
    // const { username } = req.body;

    const { username } = req.query;
    // although i doubt this will reall matter
    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }
    // Find the user by username
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Completion have been sucessfully found",
      completions: user.completions,
    });
    // const userDoc = await findId(username);
    // const userId = userDoc?._id;
    // if (!userId) {
    //   return res.status(400).json({
    //     message: "Can't find user Id",
    //   });
    // }
    //
    // let allCompletions = await User.findById(userId).select({
    //   completions: 1,
    //   _id: 0,
    // });
    // allCompletions = allCompletions.completions;
    // res.status(201).json({
    //   message: "Completion have been sucessfully found",
    //   allCompletions,
    // });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
  updateCompletion,
  getCompletion,
};
