// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
import CartDropdown from './CartDropdown'
import UserDropdown from './UserDropdown'
import UserNotLogin from './NotLogin'
import NavbarSearch from './NavbarSearch'
import NotificationDropdown from './NotificationDropdown'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'
import { isUserLoggedIn } from '../../../../utility/Utils'
import { ROLES_APP } from '../../../../constants/app'
import { useSelector } from 'react-redux'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const store = useSelector((state) => state.auth);

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <ul className='nav navbar-nav align-items-center ml-auto ' >
       {/* <NavItem className='d-none d-lg-block'>
        {
         <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
        }
        
      </NavItem> */}
      {/* <IntlDropdown /> */}
{/*      
      <CartDropdown />
      <NotificationDropdown /> */}
      {/* <NavbarSearch /> */}
{/* 
      {
        isUserLoggedIn()
        ?
      :<UserNotLogin/>

      } */}
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
