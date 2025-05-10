const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
// const taskRoutes = require("./taskRoutes");
const tripRoutes = require("./tripRoutes");

router.use("/user", userRoutes);
// router.use("/task", taskRoutes);
router.use("/trip", tripRoutes);

module.exports = router;
