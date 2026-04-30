import { User } from "../models/user.model.js";

const findId = (userName) => User.findOne({ userName }).select("_id");

// Create task
const createTask = async (req, res) => {
  // tasks.push({
  //   id: tasks.length + 1,
  //   name: taskInput.value,
  //   color: randomColor,
  //   position: tasks.length + 1,
  //   totalCount: 0,
  //   currentStreak: 0,
  //   longestStreak: 0,
  // });
  try {
    const {
      userName,
      id,
      name,
      color,
      position,
      totalCount,
      longestStreak,
      currentStreak,
    } = req.body;
    // although i doubt this will reall matter
    if (
      !id ||
      !name ||
      !color ||
      !position ||
      !totalCount ||
      !longestStreak ||
      !currentStreak
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const userId = findId(userName);
    if (!userId) {
      return res.status(400).json({
        message: "Can't find user Id",
      });
    }

    const task = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          tasks: id,
          name,
          color,
          position,
          totalCount,
          longestStreak,
          currentStreak,
        },
      },
      { new: true },
    );

    console.log(task);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { createTask };
