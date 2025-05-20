import LoginPage from "@views/login";
import TripAdmin from "@/views/manage";
import UserAdmin from "@/views/admin";
import NotFound from "@/views/error/404";
import Unauthorized from "@/views/error/401";
import withAuth from "@/views/withAuth";
import HomePage from "@/views/home";

// 包装组件，指定需要的角色
const UserAdminWithAuth = withAuth(UserAdmin, "super");

const routes = [
  {
    path: "/home",
    component: HomePage,
    label: "HomePage",
  },
  {
    path: "/tripAdmin",
    component: TripAdmin,
    label: "TripAdmin",
  },
  {
    path: "/userAdmin",
    component: UserAdminWithAuth,
    label: "UserAdmin",
  },
  {
    path: "/",
    component: LoginPage,
    label: "Login",
    isPublic: true, // 添加标识符，表示该路由是否公开
  },
  {
    path: "/401",
    component: Unauthorized,
    label: "Unauthorized",
    isPublic: true,
  },
  {
    path: "*",
    component: NotFound,
    label: "NotFound",
    isPublic: true,
  },
];

export default routes;
