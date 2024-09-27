import { lazy } from "react";
import { Redirect } from "react-router-dom";
import { ACTION, MANAGEMENT } from "../../constants/app";

const AppRoutes = [
  {
    path: "/apps/user/list",
    component: lazy(() => import("../../views/apps/cms/user/list")),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/user/add",
    component: lazy(() => import("../../views/apps/cms/user/add/index")),
    meta: {
      navLink: "/apps/user/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/user/edit/:code",
    component: lazy(() => import("../../views/apps/cms/user/edit")),
    meta: {
      navLink: "/apps/user/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  {
    path: "/apps/cms/pos",
    component: lazy(() => import("../../views/apps/cms/pos/index")),
    meta: {
      navLink: "/apps/cms/pos",
    },
    // management: MANAGEMENT.OPERATING,
    action: ACTION.VIEW,
    isShowTour: true,
  },

  // công ty
  {
    path: "/apps/cms/company/list",
    component: lazy(() => import("../../views/apps/cms/company/list/index")),
    action: ACTION.VIEW,
  },
  {
    path: "/apps/cms/company/add",
    component: lazy(() => import("../../views/apps/cms/company/add/index")),
    meta: {
      navLink: "/apps/company/add",
    },

    action: ACTION.CREATE,
  },
  {
    path: "/apps/cms/company/edit",
    exact: true,
    component: () => <Redirect to="/apps/company/edit/1" />,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/cms/company/edit/:id",
    component: lazy(() => import("../../views/apps/cms/company/edit/index")),
    meta: {
      navLink: "/apps/cms/company/edit",
    },
    action: ACTION.UPDATE,
  },

  // Chi nhánh
  {
    path: "/apps/cms/branch/list",
    component: lazy(() => import("../../views/apps/cms/branch/list/index")),
    isShowTour: true,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/branch/add",
    component: lazy(() => import("../../views/apps/cms/branch/add/index")),
    meta: {
      navLink: "/apps/branch/add",
    },
    isShowTour: true,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/branch/edit/:id",
    component: lazy(() => import("../../views/apps/cms/branch/edit/index")),
    meta: {
      navLink: "/apps/branch/edit",
    },
    isShowTour: true,
    action: ACTION.UPDATE,
  },

  //customer
  {
    path: "/apps/customer/list",
    component: lazy(() => import("../../views/apps/cms/customer/list")),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/customer/add",
    component: lazy(() => import("../../views/apps/cms/customer/add/index")),
    meta: {
      navLink: "/apps/customer/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/customer/edit/:code",
    component: lazy(() => import("../../views/apps/cms/customer/edit")),
    meta: {
      navLink: "/apps/customer/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  //department
  {
    path: "/apps/department/add",
    component: lazy(() =>
      import("../../views/apps/cms/customer/add/add-department")
    ),
    meta: {
      navLink: "/apps/department/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/department/edit/:id",
    component: lazy(() =>
      import("../../views/apps/cms/customer/edit/deparment")
    ),
    meta: {
      navLink: "/apps/department/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  //jobfield: lĩnh vực
  {
    path: "/apps/category/jobfield/list",
    component: lazy(() =>
      import("../../views/apps/cms/category/jobfield/list")
    ),
    management: MANAGEMENT.CATEGORY,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/report/list",
    component: lazy(() =>
      import("../../views/apps/cms/report/report_task/list")
    ),
    management: MANAGEMENT.CATEGORY,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/category/jobfield/add",
    component: lazy(() =>
      import("../../views/apps/cms/category/jobfield/add/index")
    ),
    meta: {
      navLink: "/apps/category/jobfield/add",
    },
    management: MANAGEMENT.CATEGORY,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/category/jobfield/edit/:id",
    component: lazy(() =>
      import("../../views/apps/cms/category/jobfield/edit/index")
    ),
    meta: {
      navLink: "/apps/category/jobfield/edit",
    },
    management: MANAGEMENT.CATEGORY,
    action: ACTION.UPDATE,
  },

  //workingprocesstemplate: quy trình công việc mẫu
  {
    path: "/apps/category/workingprocesstemplate/list",
    component: lazy(() =>
      import("../../views/apps/cms/category/workingprocesstemplate/list")
    ),
    management: MANAGEMENT.WORKINGPROCESSTEMPLATE,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/category/workingprocesstemplate/add",
    component: lazy(() =>
      import("../../views/apps/cms/category/workingprocesstemplate/add/index")
    ),
    meta: {
      navLink: "/apps/category/workingprocesstemplate/add",
    },
    management: MANAGEMENT.WORKINGPROCESSTEMPLATE,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/category/workingprocesstemplate/edit/:id",
    component: lazy(() =>
      import("../../views/apps/cms/category/workingprocesstemplate/edit/index")
    ),
    meta: {
      navLink: "/apps/category/workingprocesstemplate/edit",
    },
    management: MANAGEMENT.WORKINGPROCESSTEMPLATE,
    action: ACTION.UPDATE,
  },

  //inquiry: nhu cầu
  {
    path: "/apps/inquiry/list",
    component: lazy(() => import("../../views/apps/cms/inquiry/list")),
    management: MANAGEMENT.INQUIRY,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/inquiry/add",
    component: lazy(() => import("../../views/apps/cms/inquiry/add/index")),
    meta: {
      navLink: "/apps/inquiry/add",
    },
    management: MANAGEMENT.INQUIRY,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/inquiry/edit/:id",
    component: lazy(() => import("../../views/apps/cms/inquiry/edit/index")),
    meta: {
      navLink: "/apps/inquiry/edit",
    },
    management: MANAGEMENT.INQUIRY,
    action: ACTION.UPDATE,
  },

  //contract: hợp đồng
  {
    path: "/apps/contract/list",
    component: lazy(() => import("../../views/apps/cms/contract/list")),
    management: MANAGEMENT.CONTRACT,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/contract/add",
    component: lazy(() => import("../../views/apps/cms/contract/add/index")),
    meta: {
      navLink: "/apps/contract/add",
    },
    management: MANAGEMENT.CONTRACT,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/contract/edit/:id",
    component: lazy(() => import("../../views/apps/cms/contract/edit/index")),
    meta: {
      navLink: "/apps/contract/edit",
    },
    management: MANAGEMENT.CONTRACT,
    action: ACTION.UPDATE,
  },

  //job: công việc
  {
    path: "/apps/job/list",
    component: lazy(() => import("../../views/apps/cms/job/list")),
    management: MANAGEMENT.JOB,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/job/add",
    component: lazy(() => import("../../views/apps/cms/job/add/index")),
    meta: {
      navLink: "/apps/job/add",
    },
    management: MANAGEMENT.JOB,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/job/edit/:id",
    component: lazy(() => import("../../views/apps/cms/job/edit/index")),
    meta: {
      navLink: "/apps/job/edit",
    },
    management: MANAGEMENT.JOB,
    action: ACTION.UPDATE,
  },

  //task: chi tiết công việc
  {
    path: "/apps/task/add",
    component: lazy(() => import("../../views/apps/cms/job/add/add-task")),
    meta: {
      navLink: "/apps/task/add",
    },
    management: MANAGEMENT.JOB,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/task/edit/:id",
    component: lazy(() => import("../../views/apps/cms/job/edit/edit-task")),
    meta: {
      navLink: "/apps/task/edit",
    },
    management: MANAGEMENT.JOB,
    action: ACTION.UPDATE,
  },

  //danh mục envent
  {
    path: "/apps/category-post/list",
    component: lazy(() => import("../../views/apps/cms/categoryPost/list")),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/category-post/add",
    component: lazy(() =>
      import("../../views/apps/cms/categoryPost/add/index")
    ),
    meta: {
      navLink: "/apps/category-post/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/category-post/edit/:id",
    component: lazy(() => import("../../views/apps/cms/categoryPost/edit")),
    meta: {
      navLink: "/apps/category-post/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  //envent-blog
  {
    path: "/apps/envent/list",
    component: lazy(() => import("../../views/apps/cms/envent/list")),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/envent/add",
    component: lazy(() => import("../../views/apps/cms/envent/add/index")),
    meta: {
      navLink: "/apps/envent/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/envent/edit/:id",
    component: lazy(() => import("../../views/apps/cms/envent/edit")),
    meta: {
      navLink: "/apps/envent/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  //register_donate_blood - người đăng ký hiến máu
  {
    path: "/apps/register_donate_blood/list",
    component: lazy(() =>
      import("../../views/apps/cms/register_donate_blood/list")
    ),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/register_donate_blood/add",
    component: lazy(() =>
      import("../../views/apps/cms/register_donate_blood/add/index")
    ),
    meta: {
      navLink: "/apps/register_donate_blood/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/register_donate_blood/edit/:id",
    component: lazy(() =>
      import("../../views/apps/cms/register_donate_blood/edit")
    ),
    meta: {
      navLink: "/apps/register_donate_blood/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },

  //bệnh viện
  {
    path: "/apps/hospital/list",
    component: lazy(() => import("../../views/apps/cms/hospital/list")),
    management: MANAGEMENT.USER,
    action: ACTION.VIEW,
  },
  {
    path: "/apps/hospital/add",
    component: lazy(() => import("../../views/apps/cms/hospital/add/index")),
    meta: {
      navLink: "/apps/hospital/add",
    },
    management: MANAGEMENT.USER,
    action: ACTION.CREATE,
  },
  {
    path: "/apps/hospital/edit/:id",
    component: lazy(() => import("../../views/apps/cms/hospital/edit")),
    meta: {
      navLink: "/apps/hospital/edit",
    },
    management: MANAGEMENT.USER,
    action: ACTION.UPDATE,
  },
];

export default AppRoutes;
