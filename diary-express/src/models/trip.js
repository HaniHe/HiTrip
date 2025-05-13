// 编写旅行日记的数据模型，包括旅行日记的标题、内容、创建时间、更新时间、用户ID、用户昵称、用户头像、点赞数、图片列表等字段
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  // userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // userId关联到用户模型的_id字段
  userId: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  likedUsers: [{ type: String }], // 存储点赞用户的ID
  images: { type: [String], default: [] },
  location: { type: String, default: "" },       // 可选，默认空字符串
  travelMonth: { type: String, default: null },  // 可选，默认 null
  cost: { type: Number, default: 0 },           // 可选，默认 0
  days: { type: Number, default: 0 },           // 可选，默认 0
  // 审核状态：wait-待审核，pass-审核通过，reject-审核拒绝
  auditStatus: { type: String, default: "wait" },
  // 审核时间
  auditTime: { type: Date },
  // 审核人
  auditor: { type: String },
  // 删除原因
  deleteReason: { type: String },
  // 逻辑删除标识
  isDeleted: { type: Boolean, default: false },
  // 拒绝原因
  rejectReason: { type: String },
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
