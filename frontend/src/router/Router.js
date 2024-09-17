// ** React Imports
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import UserService from "@services/UserService";

// ** Utils
import { useLayout } from "@hooks/useLayout";
import { AbilityContext } from "@src/utility/context/Can";
import { handleLogin } from "@store/actions/auth";
import { isUserLoggedIn } from "@utils";

import { useRouterTransition } from "@hooks/useRouterTransition";

// ** Custom Components
import LayoutWrapper from "@layouts/components/layout-wrapper";

// ** Router Components
import {
  BrowserRouter as AppRouter,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

// ** Routes & Default Routes
import { DefaultRoute, Routes } from "./routes";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";

import HorizontalLayout from "@src/layouts/HorizontalLayout";

import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../utility/Utils";

const Router = () => {
  const [layout, setLayout] = useLayout();
  const userData = useSelector((state) => state?.auth?.userData);

  const [transition, setTransition] = useRouterTransition();
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const profile = await UserService.getProfile();
      let information = null;
      if (profile?.isSuccess) {
        information = profile?.data;
      }
      // const userData = useSelector((state)=>state?.auth?.userData)

      const newData = {
        information: information,
        accessToken: JSON.parse(localStorage.getItem("accessToken")),
        refreshToken: JSON.parse(localStorage.getItem("refreshToken")),
      };
      dispatch(handleLogin(newData));
    };
    init();
  }, []);

  const ability = useContext(AbilityContext);
  const DefaultLayout = "VerticalLayout";

  const Layouts = { VerticalLayout, BlankLayout };

  const currentActiveItem = null;

  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];
    const LayoutPaths = [];

    if (Routes) {
      Routes.filter((route) => {
        if (
          route.layout === layout ||
          (route.layout === undefined && DefaultLayout === layout)
        ) {
          if (route?.meta?.authRoute || route.isShowAll) {
            LayoutRoutes.push(route);
            LayoutPaths.push(route.path);
          }
          switch (userData?.role) {
            case "CUSTOMER":
              if (route.isShowTour) {
                LayoutRoutes.push(route);
                LayoutPaths.push(route.path);
              }
              break;
            case "ADMIN":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            case "STAFF":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            case "MANAGER":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            case "DEPUTY":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            case "PRESIDENT":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            case "VICPRESIDENT":
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);

              break;

            default:
              userData?.authorities?.forEach((author) => {
                if (
                  !route.isShowAll &&
                  !route.meta?.authRoute &&
                  route.management == author?.management &&
                  author.action?.includes(route.action)
                ) {
                  LayoutRoutes.push(route);
                  LayoutPaths.push(route.path);
                }
              });

              if (route.isShowTour) {
                LayoutRoutes.push(route);
                LayoutPaths.push(route.path);
              }
              break;
          }
        }
      });
    }
    return { LayoutRoutes, LayoutPaths };
  };

  const NotAuthorized = lazy(() =>
    import("@src/views/pages/misc/NotAuthorized")
  );

  const Error = lazy(() => import("@src/views/pages/misc/Error"));

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = (props) => {
    const route = props.route;
    let action, resource;
    if (route.meta) {
      action = route.meta.action ? route.meta.action : null;
      resource = route.meta.resource ? route.meta.resource : null;
    }

    if (
      (!isUserLoggedIn() && route.meta === undefined) ||
      (!isUserLoggedIn() &&
        route.meta &&
        !route.meta.authRoute &&
        !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
       */
      return <Redirect to="/login" />;
    } else if (route.meta && route.meta?.authRoute && isUserLoggedIn()) {
      return <Redirect to="/" />;
    } else {
      return <route.component {...props} />;
    }
  };

  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      const LayoutTag = Layouts[layout];

      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);
      const routerProps = {};
      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            routerProps={routerProps}
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={(props) => {
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta,
                      });

                      return (
                        <Suspense fallback={null}>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                          <LayoutWrapper
                            layout={DefaultLayout}
                            transition={transition}
                            setTransition={setTransition}
                            /* Conditional props */
                            /*eslint-disable */
                            {...(route.appLayout
                              ? {
                                  appLayout: route.appLayout,
                                }
                              : {})}
                            {...(route.meta
                              ? {
                                  routeMeta: route.meta,
                                }
                              : {})}
                            {...(route.className
                              ? {
                                  wrapperClass: route.className,
                                }
                              : {})}

                            /*eslint-enable */
                          >
                            <FinalRoute route={route} {...props} />
                          </LayoutWrapper>
                        </Suspense>
                      );
                    }}
                  />
                );
              })}
            </Switch>
          </LayoutTag>
        </Route>
      );
    });
  };

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path="/"
          render={() => {
            return isUserLoggedIn() ? (
              <Redirect to={DefaultRoute} />
            ) : (
              <Redirect to="/login" />
            );
          }}
        />
        {/* Not Auth Route */}
        <Route
          exact
          path="/misc/not-authorized"
          render={(props) => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Route path="*" component={Error} />
      </Switch>
    </AppRouter>
  );
};

export default Router;
