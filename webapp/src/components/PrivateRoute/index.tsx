import { Route } from "react-router-dom";
// import SliderMenu from "@Components/SliderMenu";
import { Layout } from "antd";
import { useEffect } from "react";
// import { AppContext } from "@Components/AppContext";
import "./privateRoute.scss";

export const PrivateRoute = ({ component: Component, ...rest }: any) => {
  // const context = useContext(AppContext);
  // const collapsed = context.collapsed;
  useEffect(() => {
    const sider = document.getElementById("sider");
    sider?.classList.toggle("active");
  }, []); //collapsed

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <div className="container-lg mh-100">
            <div className="d-flex wrapper">
              <div id="sider" className="sider active mh-100">
                {/* <SliderMenu /> */}
              </div>
              <div className="sider_content w-100">
                <Component {...props} />
              </div>
            </div>
          </div>
        </Layout>
      )}
    />
  );
};

export default PrivateRoute;
