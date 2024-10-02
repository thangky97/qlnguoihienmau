import React, { useState, useEffect } from "react";
import "./contact.scss";
import { ReactComponent as Facebook } from "@Assets/icons/facebook_rounded.svg";
import { ReactComponent as Phone } from "@Assets/icons/phone.svg";
import { useAppSelector, useAppDispatch } from "@Store/hooks";
import cartActions from "@Store/actions/cartActions";

import { ROUTES } from "@Constants/route";
import { useLocation } from "react-router-dom";
const Contact: React.FC = () => {
  const app = useAppSelector(state => state.app);
  const aboutSystem = JSON.parse(app?.section_system || "{}");
  const phone_1 = app?.phone_1 || null;
  const phone_2 = app?.phone_2 || null;

  const dispatch = useAppDispatch();
  const [checkAuth, setCheckAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    dispatch({
      type: cartActions.CART_UPDATE
    });
  }, []);

  useEffect(() => {
    if (
      location.pathname == ROUTES.LOGIN ||
      location.pathname == ROUTES.REGISTER ||
      location.pathname == ROUTES.FORGOT ||
      location.pathname == ROUTES.SETUP ||
      location.pathname == ROUTES.SETPASS ||
      (location.pathname?.includes("offline-classes") &&
        ROUTES.OFFLINECLASSES?.includes("offline-classes")) ||
      location.pathname == ROUTES.LEARNING
    ) {
      setCheckAuth(false);
    } else {
      setCheckAuth(true);
    }
  }, [location]);

  return (
    <>
      {checkAuth && (
        <div className="contact">
          <div className="item">
            <span className="facebook" title="Facebook">
              <a
                target={"_blank"}
                href={aboutSystem?.link_facebook && aboutSystem?.link_facebook}
              >
                <Facebook />
              </a>
            </span>
          </div>
          <div className="item">
            <span className="hote" title="Hote">
              <a href={`tel:+${(phone_1 && phone_1) || (phone_2 && phone_2)} `}>
                <Phone />
              </a>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
