import { Route } from "react-router-dom";
import "./authroute.scss";

export const AuthRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={props => (
        <div className="auth__template">
          <div className="auth__container">
            <Component {...props} />
          </div>
        </div>
      )}
    />
  );
};

export default AuthRoute;
