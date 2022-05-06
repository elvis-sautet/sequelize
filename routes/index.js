const router = require("express").Router();
const { User, Post } = require("../models");

// fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["body", "updatedAt"],
        },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// add a new user
router.post("/new-user", async function (req, res) {
  const { name, email, roles } = req.body;
  console.log(name, email, roles);
  try {
    // push a new role to the roles array
    const newUser = await User.create({
      name: name,
      email: email,
      //   from the default roles object,add a new role while keeping the default roles
      roles: {
        ...roles,
      },
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// create a new post
router.post("/new-post", async function (req, res) {
  const { body, userId } = req.body;
  try {
    const user = await User.findOne({
      where: {
        uuid: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const newPost = await Post.create({
      body: body,
      userId: user.id,
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// fetch all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"],
          as: "user",
        },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// delete a user
router.delete("/delete-user", async function (req, res) {
  const { id } = req.body;
  try {
    const user = await User.findOne({
      where: {
        uuid: id,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await user.destroy();
    res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// find one user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
