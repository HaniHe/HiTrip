import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "@/api/login";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/actions";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import "./index.scss";
import bg from "@/assets/login-bg.png";
import logo from "@/assets/login-logo.png";


export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 如果已经登录，直接跳转到主页
    if (getToken()) {
      navigate("/home");
    }
    getCookie();
  });

  const getCookie = () => {
    const username = Cookies.get("adminName");
    const password = Cookies.get("adminPwd");
    const remember = Cookies.get("adminRemember");
    if (username && password && remember) {
      form.setFieldsValue({
        username: username,
        password: decrypt(password),
        remember: remember,
      });
    }
  };

  const onFinish = () => {
    setLoading(true);
    login(form.getFieldsValue())
      .then((response) => {
        // console.log("login success:", response);
        setLoading(false);
        const payload = {
          user: response.userInfo,
          token: response.token,
        };
        dispatch(setUser(payload));
        if (form.getFieldValue("remember")) {
          Cookies.set("adminName", form.getFieldValue("username"), {
            expires: 3, //cookie存储和token有效期都为3天
          });
          Cookies.set("adminPwd", encrypt(form.getFieldValue("password")), {
            expires: 3,
          });
          Cookies.set("adminRemember", form.getFieldValue("remember"), {
            expires: 3,
          });
          Cookies.set("adminRole", response.userInfo.role, {
            expires: 3,
          });
        } else {
          // Cookies.remove("adminName");
          // Cookies.remove("adminPwd");
          // Cookies.remove("adminRemember");
          // Cookies.remove("adminRole");
          Cookies.set("adminName", form.getFieldValue("username"), {
            expires: 1 / 12 //保留2h
          });
          Cookies.set("adminPwd", encrypt(form.getFieldValue("password")), {
            expires: 1 / 12
          });
          Cookies.set("adminRemember", form.getFieldValue("remember"), {
            expires: 1 / 12
          });
          Cookies.set("adminRole", response.userInfo.role, {
            expires: 1 / 12
          });
        }
        // 跳转到主页
        navigate("/home");
      })
      .catch((error) => {
        console.error("login failed:", error);
        setLoading(false);
      });
  };

  return (
    <div className="log">
      {/* <div className="logTitle">HiTrip后台管理系统</div> */}
      <div className="logTitle">
        <div className="logo-container">
          <img src={logo} alt="HiTrip Logo" className="logo" />
        </div>
        <span>HiTrip后台管理系统</span>
      </div>
      <div className="logContent">
        <div className="logImg">
          <img src={bg} alt="" />
        </div>
        <div className="logForm">
          <div className="formTitle">欢迎登录</div>
          <div className="formContent">
            <Form
              form={form}
              name="normal_login"
              onFinish={onFinish}
              initialValues={{ remember: false }}
              className="ruleForm"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: "请输入用户名" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: "密码不能为空" },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <div className="submit">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                  >
                    登录
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}