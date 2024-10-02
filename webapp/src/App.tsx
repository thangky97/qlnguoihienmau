import { LoadingOutlined } from "@ant-design/icons";
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "@Containers/Login";
import RegisterForm from "@Containers/Register";
import ForgotForm from "@Containers/ForgotPassword";
import NewPassForm from "@Containers/RecoveryPassword";
import SetUpForm from "@Containers/SetupInformation";
import SetPasswordForm from "@Containers/SetPassword";
import LandingPage from "@Containers/LandingPage/Home";
import Blog from "@Containers/LandingPage/Blog";
import ThankYouPage from "@Components/Common/ThankYouPage";
import { NotFoundPage } from "@Components/Common/NotFoundPage";
import { ROUTES } from "@Constants/route";
import PublicRoute from "@Components/Layout/PublicRoute";
import PrivateRoute from "@Components/Layout/PrivateRoute";
import { useAppSelector } from "@Store/hooks";
import Profile from "@Containers/Profile";
import DetailPost from "@Containers/DetailPost";
import ContactUs from "@Containers/ContactUs";
import TermOfUse from "@Containers/TermOfUse";
import Question from "@Containers/Question";
import { ToastContainer } from "react-toastify";
import LandingLayout from "@Components/LandingPageLayout";
import ScrollToTop from "@Components/Scroll/ScrollToTop";

import MyService from "@Containers/MyService";
import Documentation from "@Containers/LandingPage/Documentation";
import { useTranslation } from "react-i18next";
import Contact from "@Components/Contact";

// import "video-react/dist/video-react.css";
//Dùng route nào thì khai báo tiếp trong này
export const routes: any = {
  blog: {
    path: ROUTES.BLOG,
    isUseCustomLayout: true,
    component: Blog,
    isAuth: false
  },
  blogdetail: {
    path: ROUTES.BLOGDETAIL,
    isUseCustomLayout: true,
    component: Blog,
    isAuth: false
  },
  document: {
    path: ROUTES.DOCUMENTATION,
    component: Documentation,
    isUseCustomLayout: true,
    isAuth: false
  },
  login: {
    path: ROUTES.LOGIN,
    component: LoginForm,
    isAuth: false
  },
  register: {
    path: ROUTES.REGISTER,
    component: RegisterForm,
    isAuth: false
  },

  forgot: {
    path: ROUTES.FORGOT,
    component: ForgotForm,
    isAuth: false
  },
  newPass: {
    path: ROUTES.NEWPASS,
    component: NewPassForm,
    isAuth: false
  },
  setUp: {
    path: ROUTES.SETUP,
    component: SetUpForm,
    isAuth: false
  },
  setPass: {
    path: ROUTES.SETPASS,
    component: SetPasswordForm,
    isAuth: false
  },
  profile: {
    path: ROUTES.PROFILE,
    component: Profile,
    isAuth: true
  },
  myService: {
    path: ROUTES.MY_SERVICE,
    isAuth: true,
    component: MyService
  },
  detailPost: {
    path: ROUTES.DETAIL_DOC,
    isAuth: false,
    component: DetailPost,
    isUseCustomLayout: true
  },
  contactUs: {
    path: ROUTES.CONTACTUS,
    isAuth: false,
    component: ContactUs,
    isUseCustomLayout: true
  },
  question: {
    path: ROUTES.QUESTION,
    isAuth: false,
    component: Question,
    isUseCustomLayout: true
  },
  termOfUse: {
    path: ROUTES.TERMOFUSE,
    isAuth: false,
    component: TermOfUse,
    isUseCustomLayout: true
  },
  thankYouPage: {
    path: ROUTES.THANKYOU,
    isAuth: true,
    component: ThankYouPage
  },
  notFound: {
    path: ROUTES.NOTFOUND,
    isAuth: true,
    component: NotFoundPage
  }
};

//Kệ cái này !!!
routes.home = {
  path: "/",
  component: LandingPage,
  isAuth: false,
  isUseCustomLayout: true
};

const App: React.FC = (): JSX.Element => {
  const user = useAppSelector(state => state.user);
  const { t: translation, i18n } = useTranslation();

  useEffect(() => {
    window.localStorage.removeItem("app_config");
    let appData = window.localStorage.getItem("app_config");
    appData = JSON.parse(appData || "{}");
    // @ts-ignore
    if (appData.lang !== i18n.language) {
      // @ts-ignore
      i18n.changeLanguage(appData.lang);
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="h-full flex align-middle justify-center">
            <LoadingOutlined />
          </div>
        }
      >
        <div className="wrapper ">
          <Routes>
            {Object.keys(routes).map(key => {
              if (routes[key].isUseCustomLayout) {
                return (
                  <Route
                    key={key}
                    path={routes[key].path}
                    element={
                      <LandingLayout Component={routes[key].component} />
                    }
                  />
                );
              } else if (routes[key].isAuth) {
                return (
                  <Route
                    key={key}
                    path={routes[key].path}
                    element={<PrivateRoute Component={routes[key].component} />}
                  />
                );
              } else if (!routes[key].isAuth) {
                return (
                  <Route
                    key={key}
                    path={routes[key].path}
                    element={
                      <PublicRoute
                        user={user}
                        Component={routes[key].component}
                      />
                    }
                  />
                );
              }
            })}
            {user?.isLoggedIn ? (
              <Route
                path="/"
                element={<PrivateRoute Component={routes.home.component} />}
              />
            ) : (
              <Route
                path="/"
                element={<PublicRoute Component={routes.login.component} />}
              />
            )}
          </Routes>
        </div>
      </Suspense>
      <Contact />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
