import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import { menuItems } from "../../constants/menuItems";

export default function NavigationMenu() {
  return (
    <div className="h-full">
      <Menu
        mode="inline"
        selectedKeys={[useLocation().pathname]}
        className="h-full border-r-0"
        items={menuItems}
      />
    </div>
  );
}
