const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "http://oss-cn-shu.oss-cn-shanghai.aliyuncs.com/HiTrip/images/b35a2c81594bcde2ac61b2ebe4f1e281.jpg",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
