// ** React Imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { isUserLoggedIn } from "@utils";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@store/actions/auth";

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

import { ROLES_APP } from "../../../../../src/constants/app";
import { getUserData } from "../../../../../src/utility/Utils";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  // const [userData, setUserData] = useState(null);
  const userData = useSelector((state)=>state?.auth?.userData)

  const userRoleData = getUserData();

  //** ComponentDidMount
 

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
        {/* {userRoleData?.role === ROLES_APP.COMPANYADMIN && ( */}
          <span className="user-name">
          {(userData && userData["name"]) || ""}
          </span>
        {/*  )} */}
          {/* <span className="user-name font-weight-bold">
            {(userData && userData["username"]) || "John Doe"}
          </span>
          <span className="user-status">
            {(userData && userData.role) || "Admin"}
          </span> */}
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu right>
        {/* <DropdownItem tag={Link} to="/pages/profile">
          <User size={14} className="mr-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem> */}
        {/*  <DropdownItem tag={Link} to="/apps/email">
          <Mail size={14} className="mr-75" />
          <span className="align-middle">Inbox</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/todo">
          <CheckSquare size={14} className="mr-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/chat">
          <MessageSquare size={14} className="mr-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem>
        <DropdownItem divider /> */}
        <DropdownItem tag={Link} to="/pages/account-settings">
          <Settings size={14} className="mr-75" />
          <span className="align-middle">Cài đặt</span>
        </DropdownItem>
        {/* <DropdownItem divider />
        <DropdownItem tag={Link} to="/pages/pricing">
          <CreditCard size={14} className="mr-75" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/pages/faq">
          <HelpCircle size={14} className="mr-75" />
          <span className="align-middle">FAQ</span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="mr-75" />
          <span className="align-middle">Đăng xuất</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
