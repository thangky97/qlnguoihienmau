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
  Row,
  Col,
} from "reactstrap";
import {
  User,
  LogIn,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  
  const userData = useSelector
  ((state)=>state?.auth?.userData)


 

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
   <>
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
   
   <Row className="nav-link dropdown-user-link ml-4 flex">
     <Col>
     <Link to={'/login'}>
     

         <User /> Login
     </Link>

     </Col>
   </Row>
   
 </UncontrolledDropdown>
  <UncontrolledDropdown tag="li" className="dropdown-user nav-item">

  <Row className="nav-link dropdown-user-link  flex">
    <Col>
      <Link to={"/register"}>
      Register
      
      </Link>
    </Col>
  </Row>
  
  
</UncontrolledDropdown></>
  );
};

export default UserDropdown;
