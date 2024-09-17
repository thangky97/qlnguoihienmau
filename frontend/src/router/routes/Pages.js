import { lazy } from "react";
import { Redirect } from "react-router-dom";
import { ROLES_APP } from "../../constants/app";

const PagesRoutes = [
  {
    path: "/login",
    component: lazy(() => import("../../views/pages/authentication/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../../views/pages/authentication/Register1")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/forgot-password",
    component: lazy(() =>
      import("../../views/pages/authentication/ForgotPassword")
    ),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password/:token",
    component: lazy(() =>
      import("../../views/pages/authentication/ResetPasswordV1")
    ),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/verify",
    component: lazy(() => import("../../views/pages/authentication/Verify")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/pages/account-settings",
    component: lazy(() => import("../../views/pages/account-settings")),
    role: [
      ROLES_APP.DEPUTY,
      ROLES_APP.ADMIN,
      ROLES_APP.CUSTOMER,
      ROLES_APP.VICPRESIDENT,
      ROLES_APP.PRESIDENT,
      ROLES_APP.STAFF,
    ],
    isShowAll: true,
  },
  {
    path: "/misc/coming-soon",
    component: lazy(() => import("../../views/pages/misc/ComingSoon")),
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
    },
    role: [
      ROLES_APP.DEPUTY,
      ROLES_APP.ADMIN,
      ROLES_APP.CUSTOMER,
      ROLES_APP.VICPRESIDENT,
      ROLES_APP.PRESIDENT,
      ROLES_APP.STAFF,
    ],
  },
  {
    path: "/misc/not-authorized",
    component: lazy(() => import("../../views/pages/misc/NotAuthorized")),
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
    },
    role: [
      ROLES_APP.DEPUTY,
      ROLES_APP.ADMIN,
      ROLES_APP.CUSTOMER,
      ROLES_APP.VICPRESIDENT,
      ROLES_APP.PRESIDENT,
      ROLES_APP.STAFF,
    ],
  },
  {
    path: "/misc/maintenance",
    component: lazy(() => import("../../views/pages/misc/Maintenance")),
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
    },
    role: [
      ROLES_APP.DEPUTY,
      ROLES_APP.ADMIN,
      ROLES_APP.CUSTOMER,
      ROLES_APP.VICPRESIDENT,
      ROLES_APP.PRESIDENT,
      ROLES_APP.STAFF,
    ],
  },
  {
    path: "/misc/error",
    component: lazy(() => import("../../views/pages/misc/Error")),
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
    },
    role: [
      ROLES_APP.DEPUTY,
      ROLES_APP.ADMIN,
      ROLES_APP.CUSTOMER,
      ROLES_APP.VICPRESIDENT,
      ROLES_APP.PRESIDENT,
      ROLES_APP.STAFF,
    ],
  },
];

export default PagesRoutes;
