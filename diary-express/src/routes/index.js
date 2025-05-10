const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
// const taskRoutes = require("./taskRoutes");
const tripRoutes = require("./tripRoutes");
const adminRoutes = require("./adminRoutes");
const eventRoutes = require("./eventRoute");


router.use("/user", userRoutes);
router.use("/trip", tripRoutes);
router.use("/admin", adminRoutes);
router.use("/event", eventRoutes);



module.exports = router;
