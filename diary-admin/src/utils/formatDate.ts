import moment from "moment";

// 格式化日期，处理多种MongoDB日期格式
const formatDate = (date) => {
  if (!date) return "未知时间";
  
  // 处理MongoDB日期对象，可能有多种格式
  if (typeof date === 'object' && date.$date) {
    // 如果是MongoDB导出的日期对象 { $date: "2025-05-11T04:21:19.465+00:00" }
    return moment(date.$date).format("YYYY-MM-DD HH:mm:ss");
  }
  
  // 直接使用日期字符串
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export default formatDate;