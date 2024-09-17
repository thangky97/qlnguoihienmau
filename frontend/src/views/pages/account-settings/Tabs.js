import { Nav, NavItem, NavLink } from "reactstrap";
import { User, Lock, Info, Link, Bell } from "react-feather";
import { getUserData } from "../../../utility/Utils";
import { ROLES_APP } from "../../../constants/app";
import { useSelector } from "react-redux";

const Tabs = ({ activeTab, toggleTab }) => {
  const userData = useSelector((state)=>state?.auth?.userData)

  return (
    <Nav className="nav-left" pills vertical>
      {/* <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <User size={18} className='mr-1' />
          <span className='font-weight-bold'>General</span>
        </NavLink>
      </NavItem> */}
      <NavItem>
        <NavItem>
          <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
            <Info size={18} className="mr-1" />
            <span className="font-weight-bold">Thông tin cá nhân</span>
          </NavLink>
        </NavItem>


{
  userData?.role != ROLES_APP.CUSTOMER &&
  <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Lock size={18} className="mr-1" />
          <span className="font-weight-bold">Đổi mật khẩu</span>
        </NavLink>
}
        
      </NavItem>

      {/* <NavItem>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
          <Link size={18} className='mr-1' />
          <span className='font-weight-bold'>Social</span>
        </NavLink>
      </NavItem> */}
      {/* <NavItem>
        <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
          <Bell size={18} className='mr-1' />
          <span className='font-weight-bold'>Notifications</span>
        </NavLink>
      </NavItem> */}
    </Nav>
  );
};

export default Tabs;
