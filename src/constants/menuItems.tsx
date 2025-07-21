import { UserOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";

export const menuItems: MenuProps["items"] = [
  {
    key: "/",
    icon: <UserOutlined />,
    label: <Link to="/">Users</Link>,
  },
  {
    key: "/tasks",
    icon: <CheckSquareOutlined />,
    label: <Link to="/tasks">Tasks</Link>,
  },
];
