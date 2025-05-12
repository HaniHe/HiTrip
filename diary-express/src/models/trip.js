const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  // userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // userId关联到用户模型的_id字段
  userId: { type: String, required: true },
  username: { type: String },
  avatar: {
    type: String,
    default:
      "http://oss-cn-shu.aliyuncs.com/public/images/8ea864552b199085f746839df5e16428.png",
  },
  // likeCount: { type: Number, default: 0 },
  images: { type: [String], default: [] },
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
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;