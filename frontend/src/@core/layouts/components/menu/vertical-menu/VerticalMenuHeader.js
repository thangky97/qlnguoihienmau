// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Third Party Components
import { Disc, X, Circle } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;
  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div className="navbar-header mb-2">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item mr-auto">
          <NavLink to="/" className="navbar-brand">
            <span className="brand-logo">
              <img src={themeConfig.app.appLogoImage} alt="logo" />
            </span>

            <div className="brand-container">
                <h5 className="brand-text mb-0">{themeConfig.app.appCompany}</h5>
                <h5 className="brand-text mb-0">{themeConfig.app.appName}</h5>
            </div>

            {/* <h5 className="brand-text mb-0">{themeConfig.app.appCompany}</h5>
            <br></br>
            <h5 className="brand-text mb-0">{themeConfig.app.appName}</h5> */}
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className=" cursor-pointer icon-toggle">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
