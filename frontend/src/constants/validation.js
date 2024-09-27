import * as yup from "yup";
import {
  REGEX_EMAIL,
  REGEX_NAME,
  REGEX_NOT_SPACE,
  REGEX_NUMBER,
  REGEX_PHONE,
} from "./regex";
export const SCHEMA_LOGIN = {
  username: yup
    .string()
    .trim()

    .required("Vui lòng nhập tên đăng nhập"),

  password: yup
    .string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có tối thiểu 6 kí tự"),
};

export const SCHEMA_REGISTER = {
  name: yup.string().trim().required("Vui lòng nhập tên công ty"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .min(5, "Tên tài khoản tối thiểu 5 kí tự")
    .matches(REGEX_NOT_SPACE, "Tên đăng nhập không hợp lệ"),
  password: yup
    .string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có 6 kí tự trở lên"),

  confirm_password: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
};

export const SCHEMA_UPADTE_PROFILE = {};

export const SCHEMA_SIGN_UP = {
  // name: yup.string().trim().required("Vui lòng nhập tên đại lý"),
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .min(5, "Tên tài khoản tối thiểu 5 kí tự")
    .matches(REGEX_NOT_SPACE, "Tên đăng nhập không hợp lệ"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  referral_source_id: yup.object().required("Vui lòng chọn nguồn giới thiệu"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  password: yup
    .string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có 6 kí tự trở lên"),

  confirm_password: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
};

export const SCHEMA_ADD_USER = {
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tài khoản")
    .min(5, "Tên tài khoản tối thiểu 5 kí tự")
    .matches(REGEX_NOT_SPACE, "Tên đăng nhập không hợp lệ"),

  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),

  status: yup.object().required("Vui lòng nhập trạng thái"),
  name: yup.string().trim().required("Vui lòng nhập tên"),
  role: yup.object().required("Vui lòng nhập quyền"),
  password: yup
    .string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có 6 kí tự trở lên"),
};

export const SCHEMA_ADD_CUSTOMER = {
  name: yup.string().trim().required("Vui lòng nhập tên"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  date_birthday: yup.date().required("Vui lòng nhập năm sinh"),
  weight: yup.string().trim().required("Vui lòng nhập cân nặng"),
  height: yup.string().trim().required("Vui lòng nhập chiều cao"),
};

export const SCHEMA_UPDATE_USER = {
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .matches(REGEX_NOT_SPACE, "Tên đăng nhập không hợp lệ"),

  status: yup.object().required("Vui lòng nhập trạng thái"),
  name: yup.string().trim().required("Vui lòng nhập tên"),
  password: yup.string().trim().required("Vui lòng nhập mật khẩu"),

  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
};

export const SCHEMA_CATEGORY = {
  name: yup
    .string()
    .trim()
    .required("The fullname field is required")
    .min(4, "Require more than 4 characters")
    .matches(REGEX_NAME, "Invalid fullname"),
};
export const SCHEMA_FORGOT_PASSWORD = {
  email: yup
    .string()
    .trim()
    .required("The email field is required")
    .matches(REGEX_EMAIL, "Invalid email"),
};
export const SCHEMA_CHANGE_PASSWORD = {
  current_password: yup.string().trim().required("Vui lòng nhập mật khẩu cũ"),
  new_password: yup.string().trim().required("Vui lòng nhập mật mới"),
  retype_new_password: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu mới")
    .oneOf([yup.ref(`new_password`), null], "Mật khẩu mới không khớp"),
};
export const SCHEMA_RESET_PASSWORD = {
  password: yup
    .string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có 6 kí tự trở lên"),

  retype_password: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
};
export const SCHEMA_EMPLOYEE = {
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập phải tối thiểu 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),
  name: yup.string().trim().required("Vui lòng nhập họ tên"),
  identityCard: yup.string().trim().required("Vui lòng nhập CMND/CCCD"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  birthDay: yup.date().required("Vui lòng chọn ngày sinh"),
};
export const SCHEMA_UPDATE_CUSTOMER = {
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ tên")
    .max(255, "Họ tên tối đa 255 ký tự"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  height: yup.number().min(0),
  weight: yup.number().min(0),
};
export const SCHEMA_CREATE_PRODUCT_SET = {
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên")
    .max(255, "Tên tối đa 255 ký tự"),
};
export const SCHEMA_CREATE_BRAND = {
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên")
    .max(255, "Tên tối đa 255 ký tự"),
  productSet: yup.object().required("Vui lòng chọn tập sản phẩm"),
};
export const SCHEMA_CREATE_CATEGORY = {
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên")
    .max(255, "Tên tối đa 255 ký tự"),
  productSet: yup.object().required("Vui lòng chọn tập sản phẩm"),
};

export const SCHEMA_PROPERTY_PRODUCT = {
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên")
    .max(255, "Tên tối đa 255 ký tự"),
};

export const SCHEMA_PRODUCT = {
  category: yup.object().required("Vui lòng nhập danh mục"),
  startDate: yup.string().required("Vui lòng nhập ngày bắt đầu").nullable(),
  startTime: yup
    .string()
    .required("Vui lòng nhập thời gian bắt đầu")
    .nullable(),
  endTime: yup.string().required("Vui lòng nhập thời gian kết thúc").nullable(),
  code: yup
    .string()
    .trim()
    .required("Vui lòng nhập mã")
    .matches(REGEX_NOT_SPACE, "Mã không hợp lệ"),
  amis_code: yup
    .string()
    .trim()
    .required("Vui lòng nhập mã")
    .matches(REGEX_NOT_SPACE, "Mã không hợp lệ"),
  default_expire_hold: yup
    .string()
    .matches(REGEX_NUMBER, "Vui lòng kiểu số")
    .required("Vui lòng nhập hạn thanh toán"),
  endDate: yup.string().required("Vui lòng nhập ngày kết thúc").nullable(),
  type: yup.object().required("Vui lòng nhập kiểu"),
  tour_route_code: yup.object().required("Vui lòng chọn tuyến tour"),
  area: yup.object().required("Vui lòng chọn thị trường"),
  is_over_sheet: yup.object().required("Vui lòng nhập chọn quyền"),
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên tour")
    .max(255, "Tên tối đa 255 ký tự"),

  quantity: yup
    .string()
    .required("Vui lòng nhập số lượng tồn")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  hotelStars: yup
    .string()
    .required("Vui lòng nhập số sao KS")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),

  adult_unit_price: yup.string().required("Vui lòng nhập đơn giá người lớn"),
  children_unit_price: yup.string().required("Vui lòng nhập đơn giá trẻ em"),
  baby_unit_price: yup.string().required("Vui lòng nhập đơn giá trẻ sơ sinh"),
  discount: yup.string().required("Vui lòng nhập giá triết khấu NL"),
  discount_te: yup.string().required("Vui lòng nhập giá triết khấu TE"),
  discount_eb: yup.string().required("Vui lòng nhập giá triết khấu EB"),
  travelType: yup.object().required("Vui lòng chọn loại du lịch"),
  saleStatus: yup.object().required("Vui lòng chọn hình thức bán hàng"),
  supplier: yup.object().required("Vui lòng chọn nhà cung cấp"),
  tourDeadline: yup.string().required("Vui lòng hạn đặt tour").nullable(),
  visaDeadline: yup
    .string()
    .required("Vui lòng nhập nhạn nhận hồ sơ")
    .nullable(),
};

export const SCHEMA_PRODUCT_UPDATE = {
  category: yup.object().required("Vui lòng nhập danh mục"),
  startDate: yup.string().required("Vui lòng nhập ngày bắt đầu").nullable(),
  startTime: yup
    .string()
    .required("Vui lòng nhập thời gian bắt đầu")
    .nullable(),
  endTime: yup.string().required("Vui lòng nhập thời gian kết thúc").nullable(),
  area_id: yup.object().required("Vui lòng chọn thị trường"),
  default_expire_hold: yup
    .string()
    .matches(REGEX_NUMBER, "Vui lòng kiểu số")
    .required("Vui lòng nhập hạn thanh toán"),
  endDate: yup.string().required("Vui lòng nhập ngày kết thúc").nullable(),
  hotelStars: yup
    .string()
    .required("Vui lòng nhập số sao KS")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  type: yup.object().required("Vui lòng nhập kiểu"),
  is_over_sheet: yup.object().required("Vui lòng nhập chọn quyền"),
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên tour")
    .max(255, "Tên tối đa 255 ký tự"),

  quantity: yup
    .string()
    .required("Vui lòng nhập số lượng tồn")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  default_expire_hold: yup
    .string()
    .matches(REGEX_NUMBER, "Vui lòng kiểu số")
    .required("Vui lòng nhập hạn thanh toán"),
  adult_unit_price: yup.string().required("Vui lòng nhập đơn giá người lớn"),
  children_unit_price: yup.string().required("Vui lòng nhập đơn giá trẻ em"),
  baby_unit_price: yup.string().required("Vui lòng nhập đơn giá trẻ sơ sinh"),
  discount: yup.string().required("Vui lòng nhập giá triết khấu NL"),
  discount_te: yup.string().required("Vui lòng nhập giá triết khấu TE"),
  discount_eb: yup.string().required("Vui lòng nhập giá triết khấu EB"),
  travelType: yup.object().required("Vui lòng chọn loại du lịch"),
  saleStatus: yup.object().required("Vui lòng chọn hình thức bán hàng"),
  supplier: yup.object().required("Vui lòng chọn nhà cung cấp"),
  tourDeadline: yup.string().required("Vui lòng hạn đặt tour").nullable(),
  visaDeadline: yup
    .string()
    .required("Vui lòng nhập nhạn nhận hồ sơ")
    .nullable(),
};

export const ACTUAL = {
  name: yup.string().required("Vui lòng nhập nhập tên"),
  amount: yup
    .string()
    .required("Vui lòng nhập số lượng")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  price: yup.string().required("Vui lòng nhập giá thực tế"),
};

export const ACTUAL_SETTLEMENT = {
  name: yup.string().required("Vui lòng nhập nhập tên"),
  amount: yup
    .string()
    .required("Vui lòng nhập số lượng")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  price: yup.string().required("Vui lòng nhập giá thực tế"),
  supplier: yup.object().required("Vui lòng chọn nhà cung cấp"),
};
export const PLAN = {
  name: yup.string().required("Vui lòng nhập nhập tên"),
  amount: yup
    .string()
    .required("Vui lòng nhập số lượng")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
  price: yup.string().required("Vui lòng nhập giá thực tế"),
};

export const SCHEMA_STOCK = {
  startDate: yup
    .string()
    .required("The startDate field is required")
    .nullable(),
  endDate: yup.string().required("The endDate field is required").nullable(),
  amount: yup
    .string()
    .required("The amount field is required")
    .matches(REGEX_NUMBER, "Vui lòng kiểu số"),
};

export const SCHEMA_DETAIL_INVOICE = {
  items: yup.array().of(
    yup.object().shape({
      customername: yup.string().required("Vui lòng nhập tên"),
      gender: yup.object(),
      passportnumber: yup
        .string()
        .matches(REGEX_NOT_SPACE, "CMT/HC không hợp lệ"),
      type: yup.object().required("Vui lòng chọn loại"),
      birthday: yup.string(),
      phone: yup.string(),
      note: yup.string(),
    })
  ),
};

export const SCHEMA_ADD_COMPANY = {
  name: yup.string().required("Vui lòng nhập tên công ty"),
  contactmobile: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  contactemail: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
  status: yup.object().required("Vui lòng nhập trạng thái"),
};

export const SCHEMA_ADD_BRANCH = {
  name: yup.string().required("Vui lòng nhập tên chi nhánh"),
  contactmobile: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  contactemail: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
  status: yup.object().required("Vui lòng nhập trạng thái"),
};

export const SCHEMA_DISCOUNT_SPECIAL = {
  items: yup.array().of(
    yup.object().shape({
      customer: yup.object().required("Vui lòng chọn đại lý"),
    })
  ),
};
export const SCHEMA_ADD_DISCOUNT_SPECIAL = {
  customer: yup.object().required("Vui lòng chọn đại lý"),
  tour: yup.object().required("Vui lòng chọn Tour"),
};

export const SCHEMA_INQUIRY = {
  source: yup.object().required("Vui lòng chọn nguồn"),
  content: yup.string().required("Vui lòng nhập cơ hội"),
  customercode: yup.object().required("Vui lòng chọn khách hàng"),
  staffcode: yup.object().required("Vui lòng chọn người tạo"),
  // ordercode: yup.object().required("Vui lòng chọn đơn hàng"),
};

export const SCHEMA_ADD_JOBFIELD = {
  code: yup
    .string()
    .trim()
    .required("Vui lòng nhập mã lĩnh vực")
    .matches(REGEX_NOT_SPACE, "Mã lĩnh vực không hợp lệ"),
  name: yup.string().required("Vui lòng nhập tên lĩnh vực"),
  status: yup.object().required("Vui lòng nhập trạng thái"),
};

export const SCHEMA_ADD_DEPARTMENT = {
  code: yup
    .string()
    .trim()
    .required("Vui lòng nhập mã phòng ban")
    .matches(REGEX_NOT_SPACE, "Mã phòng ban không hợp lệ"),

  name: yup.string().required("Vui lòng nhập tên phòng ban"),
};

export const SCHEMA_ADD_WORKING_PROCESS_TEMPLATE = {
  jobfield_id: yup.object().required("Vui lòng chọn lĩnh vực"),
  sequence: yup.string().required("Vui lòng nhập trình tự"),
  name: yup.string().required("Vui lòng nhập tên nhiệm vụ"),
  limitdays: yup.string().required("Vui lòng nhập ngày giới hạn"),
  department_id: yup.object().required("Vui lòng chọn phòng ban"),
};

export const SCHEMA_INQUIRYY = {
  jobfield_id: yup.object().required("Vui lòng chọn lĩnh vực"),
  customer_code: yup.object().required("Vui lòng chọn khách hàng"),
  // name: yup.string().required("Vui lòng nhập tên lĩnh vực"),
};

export const SCHEMA_CONTRACT = {
  jobfield_id: yup.object().required("Vui lòng chọn lĩnh vực"),
  signing_date: yup.string().required("Vui lòng chọn ngày ký").nullable(),
  customer_code: yup.object().required("Vui lòng chọn khách hàng"),
  // workstatus: yup.object().required("Vui lòng chọn tình trạng hợp đồng"),
  user_code: yup.object().required("Vui lòng chọn người tạo"),
  contract_number_information: yup
    .string()
    .required("Vui lòng nhập số hợp đồng"),
  name: yup.string().required("Vui lòng nhập tên hợp đồng"),
  // createDate: yup.string().required("Vui lòng chọn ngày tạo").nullable(),
};

export const SCHEMA_JOB = {
  jobfield_id: yup.object().required("Vui lòng chọn lĩnh vực"),
  // contract_id: yup.object().required("Vui lòng chọn hợp đồng"),
  user_code: yup.object().required("Vui lòng chọn người tạo"),
  name: yup.string().required("Vui lòng nhập công việc"),
  jobDate: yup.string().required("Vui lòng chọn ngày làm việc").nullable(),
};

export const SCHEMA_TASK = {
  jobfield_id: yup.object().required("Vui lòng chọn lĩnh vực"),
  job_id: yup.object().required("Vui lòng chọn công việc"),
  taskname: yup.string().required("Vui lòng nhập nhiệm vụ"),
  dealine: yup.string().required("Vui lòng nhập dealine"),
  workstatus: yup.object().required("Vui lòng chọn tình trạng"),
  processDate: yup.string().required("Vui lòng chọn ngày làm việc").nullable(),
};

export const SCHEMA_ADD_CATEGORY_POST = {
  name: yup.string().required("Vui lòng nhập tên danh mục"),
};

export const SCHEMA_ADD_ENVENT = {
  name: yup.string().required("Vui lòng nhập tên chương trình"),
  event_date: yup.date().required("Vui lòng nhập ngày tổ chức"),
  start_time: yup
    .string()
    .required("Vui lòng nhập thời gian bắt đầu")
    .nullable(),
  end_time: yup
    .string()
    .required("Vui lòng nhập thời gian kết thúc")
    .nullable(),
  location: yup.string().required("Vui lòng nhập địa điểm"),
  blood_count: yup.string().required("Vui lòng nhập số lượng đơn vị máu"),
  content: yup.string().required("Vui lòng nhập nội dung chương trình"),
  // user_id: yup.object().required("Vui lòng chọn bác sĩ"),
  user_id: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.number().required(),
        label: yup.string().required(),
      })
    )
    .min(1, "Phải chọn ít nhất một bác sĩ"), // Đảm bảo chọn ít nhất 1 bác sĩ
};

export const SCHEMA_HOSPITAL = {
  name: yup.string().trim().required("Vui lòng nhập tên bệnh viện"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(REGEX_PHONE, "Số điện thoại không hợp lệ"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
  address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
};
