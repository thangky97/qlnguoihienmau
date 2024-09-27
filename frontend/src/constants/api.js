const api = {
  DELETE_TOUR: {
    path: "/admin/delete-tour",
    method: "DELETE",
  },

  CHANGE_PASSWORD_STAFF: {
    path: "/auth/change-password",
    method: "PATCH",
  },
  REFRESH_TOKEN: {
    path: "/auth/get-access-token",
    method: "POST",
  },

  UPLOAD_IMAGE: {
    path: "/app/upload",
    method: "POST",
  },
  LIST_TOUR: {
    path: "/admin/get-tours",
    method: "GET",
  },
};
export default api;

export const FORGOT_PASSWORD = {
  path: "/auth/forgot-password",
  method: "POST",
};

export const VERIFY_EMAIL = {
  path: `/auth/verify-email`,
  method: "POST",
};
export const LIST_USER = {
  path: "/user/find",
  method: "POST",
};
export const SIGNUP_USER = {
  path: `/auth/sign-up`,
  method: "POST",
};

export const RESET_PASSWORD = {
  path: "/auth/reset-password",
  method: "POST",
};
export const GET_USER = {
  path: "/user/get-detail",
  method: "GET",
};
export const UPDATE_USER = {
  path: "/user/update",
  method: "POST",
};

export const SIGN_UP_CUSTOMER = {
  path: "/auth/sign-up-customer",
  method: "POST",
};
export const REGISTER_VALIDATE = {
  path: "/user/register-validate",
  method: "POST",
};

export const LOGIN_STAFF = {
  path: `/auth/sign-in`,
  method: "POST",
};
export const LOGIN_CUSTOMER = {
  path: "/auth/sign-in-google",
  method: "POST",
};
export const CHANGE_PASSWORD = {
  path: "/auth/change-password",
  method: "POST",
};
export const UPDATE_PROFILE = {
  path: "/user/update-profile",
  method: "POST",
};
export const ADD_USER = {
  path: "/user/create",
  method: "POST",
};
export const ADD_CUTOMER = {
  path: "/user/create-customer",
  method: "POST",
};
export const GET_ALL_OPERATOR = {
  path: "/user/find-all",
  method: "GET",
};
export const GET_ALL_CUSTOMER = {
  path: "/user/find-all-customer",
  method: "GET",
};
export const GET_ALL_STAFF = {
  path: "/user/find-all-staff",
  method: "GET",
};

export const GET_PROFILE = {
  path: "/user/profile",
  method: "GET",
};

export const GET_LIST_COMPANY = {
  path: "/company/find",
  method: "POST",
};

export const GET_ALL_COMPANY = {
  path: "/company/find-all",
  method: "GET",
};

export const CREATE_COMPANY = {
  path: "/company/create",
  method: "POST",
};
export const REGISTER_CREATE_COMPANY = {
  path: "/company/user-create",
  method: "POST",
};
export const UPDATE_COMPANY = {
  path: "/company/update",
  method: "POST",
};

export const GET_DETAIL_COMPANY = {
  path: "/company/get-detail",
  method: "GET",
};

export const GET_LIST_COMPANY_CUSTOMER = {
  path: "/company/find-company-customer",
  method: "GET",
};

export const DELETE_COMPANY = {
  path: "/user/delete_company",
  method: "POST",
};

export const DELETE_USER = {
  path: "/user/delete",
  method: "POST",
};

export const GET_LIST_BRANCH = {
  path: "/branch/find",
  method: "POST",
};

export const GET_ALL_BRANCH = {
  path: "/branch/find-all",
  method: "GET",
};

export const CREATE_BRANCH = {
  path: "/branch/create",
  method: "POST",
};
export const UPDATE_BRANCH = {
  path: "/branch/update",
  method: "POST",
};

export const GET_DETAIL_BRANCH = {
  path: "/branch/get-detail",
  method: "GET",
};

export const DELETE_BRANCH = {
  path: "/branch/delete",
  method: "POST",
};

//api lĩnh vực(jobfield)
export const GET_LIST_JOBFIELD = {
  path: "/jobfield/find",
  method: "POST",
};

export const GET_ALL_JOBFIELD = {
  path: "/jobfield/find-all",
  method: "GET",
};
export const GET_ALL_STATISTICAL = {
  path: "/jobfield/statistical",
  method: "GET",
};
export const GET_ALL_STATISTICAL_JOB = {
  path: "/jobfield/statistical-job",
  method: "GET",
};
export const CREATE_JOBFIELD = {
  path: "/jobfield/create",
  method: "POST",
};
export const UPDATE_JOBFIELD = {
  path: "/jobfield/update",
  method: "POST",
};

export const GET_DETAIL_JOBFIELD = {
  path: "/jobfield/get-detail",
  method: "GET",
};

export const DELETE_JOBFIELD = {
  path: "/jobfield/delete",
  method: "POST",
};

//api customer
export const GET_CUSTOMER = {
  path: "/customer/get-detail",
  method: "GET",
};
export const UPDATE_CUSTOMER = {
  path: "/customer/update",
  method: "POST",
};
export const LIST_CUSTOMER = {
  path: "/customer/find",
  method: "POST",
};
export const ALL_CUSTOMER = {
  path: "/customer/find-all",
  method: "GET",
};
export const ADD_CUSTOMER = {
  path: "/customer/create",
  method: "POST",
};

export const CREATE_CUTOMER = {
  path: "/customer/create-customer",
  method: "POST",
};

export const DELETE_CUSTOMER = {
  path: "/customer/delete",
  method: "POST",
};

//api department: phòng ban
export const GET_LIST_DEPARTMENT = {
  path: "/department/find",
  method: "POST",
};

export const STATISTIC_DEPARTMENT_JOB = {
  path: "/department/statistical-job",
  method: "GET",
};

export const STATISTIC_DEPARTMENT_TASK = {
  path: "/department/statistical-task",
  method: "GET",
};
export const REPORT_TASK = {
  path: "/department/report",
  method: "GET",
};

export const GET_ALL_DEPARTMENT = {
  path: "/department/find-all",
  method: "GET",
};

export const CREATE_DEPARTMENT = {
  path: "/department/create",
  method: "POST",
};
export const UPDATE_DEPARTMENT = {
  path: "/department/update",
  method: "POST",
};

export const GET_DETAIL_DEPARTMENT = {
  path: "/department/get-detail",
  method: "GET",
};

export const DELETE_DEPARTMENT = {
  path: "/department/delete",
  method: "POST",
};

//api workingprocesstemplate: quy trình cv mẫu
export const GET_LIST_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/find",
  method: "POST",
};

export const GET_ALL_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/find-all",
  method: "GET",
};

export const CREATE_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/create",
  method: "POST",
};
export const UPDATE_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/update",
  method: "POST",
};

export const GET_DETAIL_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/get-detail",
  method: "GET",
};

export const DELETE_WORKING_PROCESS_TEMPLATE = {
  path: "/workingprocesstemplate/delete",
  method: "POST",
};

//api inquiry: cơ hội
export const GET_LIST_INQUIRY = {
  path: "/inquiry/find",
  method: "POST",
};

export const GET_ALL_INQUIRY = {
  path: "/inquiry/find-all",
  method: "GET",
};

export const CREATE_INQUIRY = {
  path: "/inquiry/create",
  method: "POST",
};
export const UPDATE_INQUIRY = {
  path: "/inquiry/update",
  method: "POST",
};

export const GET_DETAIL_INQUIRY = {
  path: "/inquiry/get-detail",
  method: "GET",
};

export const DELETE_INQUIRY = {
  path: "/inquiry/delete",
  method: "POST",
};

export const UPLOAD_EXCEL_INQUIRY = {
  path: "/inquiry/import",
  method: "POST",
};

//api contract: hợp đồng
export const GET_LIST_CONTRACT = {
  path: "/contract/find",
  method: "POST",
};

export const GET_ALL_CONTRACT = {
  path: "/contract/find-all",
  method: "GET",
};

export const CREATE_CONTRACT = {
  path: "/contract/create",
  method: "POST",
};
export const UPDATE_CONTRACT = {
  path: "/contract/update",
  method: "POST",
};

export const GET_DETAIL_CONTRACT = {
  path: "/contract/get-detail",
  method: "GET",
};
export const GET_JOB_CONTRACT = {
  path: "/contract/get-job-contract",
  method: "GET",
};
export const UPLOAD_EXCEL_CONTRACT = {
  path: "/contract/import",
  method: "POST",
};

export const DELETE_CONTRACT = {
  path: "/contract/delete",
  method: "POST",
};

//api job: công việc
export const GET_LIST_JOB = {
  path: "/job/find",
  method: "POST",
};

export const GET_ALL_JOB = {
  path: "/job/find-all",
  method: "GET",
};

export const CREATE_JOB = {
  path: "/job/create",
  method: "POST",
};
export const UPDATE_JOB = {
  path: "/job/update",
  method: "POST",
};

export const GET_DETAIL_JOB = {
  path: "/job/get-detail",
  method: "GET",
};

export const DELETE_JOB = {
  path: "/job/delete",
  method: "POST",
};

//api task: chi tiết công việc
export const GET_LIST_TASK = {
  path: "/task/find",
  method: "POST",
};

export const GET_ALL_TASK = {
  path: "/task/find-all",
  method: "GET",
};

export const GET_ALL_TASK_BY_IDCONTRACT = {
  path: "/contract/find-all-task",
  method: "GET",
};

export const CREATE_TASK = {
  path: "/task/create",
  method: "POST",
};
export const UPDATE_TASK = {
  path: "/task/update",
  method: "POST",
};

export const GET_DETAIL_TASK = {
  path: "/task/get-detail",
  method: "GET",
};

export const DELETE_TASK = {
  path: "/task/delete",
  method: "POST",
};

//Thống kê
export const GET_FIND_COUNT_TASK = {
  path: "/task/find-count-task",
  method: "GET",
};

export const GET_FIND_TASK = {
  path: "/task/find-task",
  method: "GET",
};

export const GET_FIND_COUNT_JOB = {
  path: "/job/find-count-job",
  method: "GET",
};

export const GET_FIND_JOB = {
  path: "/job/find-job",
  method: "GET",
};

export const UPDATE_CONTRACT_TASKS_STATUS = {
  path: "/contract/update-contract-tasks-status",
  method: "POST",
};

//danh mục post
export const GET_LIST_CATEGORY_POST = {
  path: "/category_post/find",
  method: "POST",
};

export const GET_ALL_CATEGORY_POST = {
  path: "/category_post/find-all",
  method: "GET",
};

export const CREATE_CATEGORY_POST = {
  path: "/category_post/create",
  method: "POST",
};
export const UPDATE_CATEGORY_POST = {
  path: "/category_post/update",
  method: "POST",
};

export const GET_DETAIL_CATEGORY_POST = {
  path: "/category_post/get-detail",
  method: "GET",
};

export const DELETE_CATEGORY_POST = {
  path: "/category_post/delete",
  method: "POST",
};

//api envent: sự kiện - tin tức
export const GET_LIST_ENVENT = {
  path: "/envent/find",
  method: "POST",
};

export const GET_ALL_ENVENT = {
  path: "/envent/find-all",
  method: "GET",
};

export const CREATE_ENVENT = {
  path: "/envent/create",
  method: "POST",
};
export const UPDATE_ENVENT = {
  path: "/envent/update",
  method: "POST",
};

export const GET_DETAIL_ENVENT = {
  path: "/envent/get-detail",
  method: "GET",
};

export const DELETE_ENVENT = {
  path: "/envent/delete",
  method: "POST",
};

//người hiến máu
export const GET_LIST_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/find",
  method: "POST",
};

export const GET_ALL_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/find-all",
  method: "GET",
};

export const CREATE_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/create",
  method: "POST",
};
export const UPDATE_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/update",
  method: "POST",
};

export const GET_DETAIL_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/get-detail",
  method: "GET",
};

export const DELETE_REGISTER_DONATE_BLOOD = {
  path: "/register_donate_blood/delete",
  method: "POST",
};

//bệnh viện
export const GET_LIST_HOSPITAL = {
  path: "/hospital/find",
  method: "POST",
};

export const GET_ALL_HOSPITAL = {
  path: "/hospital/find-all",
  method: "GET",
};

export const CREATE_HOSPITAL = {
  path: "/hospital/create",
  method: "POST",
};
export const UPDATE_HOSPITAL = {
  path: "/hospital/update",
  method: "POST",
};

export const GET_DETAIL_HOSPITAL = {
  path: "/hospital/get-detail",
  method: "GET",
};

export const DELETE_HOSPITAL = {
  path: "/hospital/delete",
  method: "POST",
};
