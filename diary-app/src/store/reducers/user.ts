import { SET_USER, UPDATE_USER, CLEAR_USER } from "../actions";
import { getToken, getUserCookie } from "@/utils/auth";

const initialState = {
  user: getUserCookie() || {
    userId: "userid",
    username: "用户名",
    avatar:
      "http://oss-cn-shu.oss-cn-shanghai.aliyuncs.com/HiTrip/images/b35a2c81594bcde2ac61b2ebe4f1e281.jpg",
      
  },
  token: getToken(),
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case CLEAR_USER:
      return {
        user: null,
        token: "",
      };
    default:
      return state;
  }
};

export default userReducer;
