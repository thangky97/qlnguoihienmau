//api: product/find-all
export const exportHeader = {
  EXPORT_TITLE: "DANH SÁCH TOUR", //tiêu đề của sheet
  EXPORT_WB: "Tour.xlsx", //tên file excel
  EXPORT_WS: "Tour", //tên sheet
  ID: "ID",
  CODE: "Mã tour",
  NAME: "Tuyến tour",
  STATUS: "Trạng thái",
  START_DATE: "Ngày bắt đầu",
  END_DATE: "Ngày kết thúc",
  START_TIME: "Thời gian bắt đầu",
  END_TIME: "Thời gian kết thúc",
  DEPARTURE: "Điểm khởi hành",
  DISCOUNT: "Giảm giá",
  iS_OVER_SHEET: "Cho phép quá số lượng",
  DESCRIPTION: "Mô tả",
  TYPE: "Loại",
  CATEGORY: "Danh mục",
  NUMBER_DAY: "Số ngày",
  PRICE_ADULT: "Giá người lớn",
  PRICE_CHILDREN: "Giá trẻ em",
  PRICE_INFANT: "Giá trẻ sơ sinh",
};

export const exportHeaderReport = {
  EXPORT_TITLE: "BÁO CÁO TÌNH HÌNH CÔNG VIỆC", //tiêu đề của sheet
  EXPORT_WB: "Report.xlsx", //tên file excel
  EXPORT_WS: "Report", //tên sheet
  NAME: "Tên nhân viên ",
  DEPARTMENT_NAME: "Phòng ban",
  TOTAL: "Sl nhiệm vụ",
  NORMAL: "Quá hạn",
  OVERDUE: "Đúng hạn",
  NORMAL_PERCENTAGE: "Tỷ lệ đúng hạn",
  OVERDUE_PERCENTAGE: "Tỷ lệ quá hạn",
};
export default exportHeader;

export const exportHeaderContact = {
  EXPORT_TITLE: "TỔNG HỢP LIÊN HỆ", //tiêu đề của sheet
  EXPORT_WB: "contacthistory.xlsx", //tên file excel
  EXPORT_WS: "contacthistory", //tên sheet
  CUSTOMER: "Khách hàng",
  CONTACTINFO: "Thông tin liên hệ",
  CONTACTQTY: "Số lượt LH",
  LASTCONTACT: "Lần liên hệ cuối",
  SALEINFO: "TT Bán hàng",
};

export const exportHeaderContactHistory = {
  EXPORT_TITLE: "CHI TIẾT LIÊN HỆ", //tiêu đề của sheet
  EXPORT_WB: "contacthistory.xlsx", //tên file excel
  EXPORT_WS: "contacthistory", //tên sheet
  CUSTOMER_CODE: "Mã KH",
  CUSTOMER_NAME: "Tên KH",
  CUSTOMER_ADDRESS: "Địa chỉ",
  CUSTOMER_PHONE: "Điện thoại",
  CUSTOMER_MAIL: "Email",
  CONTACT_USER: "Người liên hệ",
  CONTACT_METHOD: "Hình thức",
  CONTACT_DATE: "Ngày liên hệ",
  CONTACT_CONTENT: "Nội dung",
};

export const exportHeaderUser = {
  EXPORT_TITLE: "DANH SÁCH NGƯỜI DÙNG", //tiêu đề của sheet
  EXPORT_WB: "User.xlsx", //tên file excel
  EXPORT_WS: "User", //tên sheet
  CODE: "Mã",
  NAME: "Tên",
  PHONE: "Số điện thoại",
  USER_NAME: "Tên tài khoản",
  PASSWORD: "Mật khẩu",
  GENDER: "Giới tính",
  ROLE: "Vai trò",
  STATUS: "Trạng thái",
  DEPARTMENT: "Phòng ban",
};

//api: order/find-all
export const exportHeaderInvoice = {
  EXPORT_TITLE: "DANH SÁCH HÓA ĐƠN", //tiêu đề của sheet
  EXPORT_WB: "Invoice.xlsx", //tên file excel
  EXPORT_WS: "Invoice", //tên sheet
  CODE: "Mã tour",
  NAME: "Tuyến tour",
  STATUS: "Trạng thái",
  EXPIRE_HOLD: "EXPIRE_HOLD",
  NOTE: "Ghi chú",
  total_amount: "total_amount",
  total_payment: "total_payment",
  remain_amount: "remain_amount",
  discount: "Giảm giá",
  staff_name: "Tên nhân viên",
};

export const exportHeaderSummaryDepartureSchedule = {
  PRODUCT_NAME: "Tên tour",
  PRODUCT_DEPARTURE: "Xuất phát",
  START_DATE: "Ngày khởi hành",
  ROUTER: "Tuyến tour",
  AIRLINE: "Hàng không",
  PRICE_ADULT: "Giá người lớn",
  PRICE_CHILDREN: "Giá trẻ em",
  PRICE_INFANT: "Giá em bé",
  HOTEL_STARTS: "Khách sạn",
};

export const exportHeaderContract = {
  EXPORT_TITLE: "DANH SÁCH HỢP ĐỒNG", //tiêu đề của sheet
  EXPORT_WB: "Contract.xlsx", //tên file excel
  EXPORT_WS: "Contract", //tên sheet
  ID: "TT",
  CONTRACT_NUMBER: "Số hợp đồng",
  NAME: "Hợp đồng",
  JOBFIELD: "Lĩnh vực",
  INQUIRY: "Nhu cầu",
  CUSTOMER: "Khách hàng",
  USER: "Người tạo",
  CREATEDATE: "Ngày tạo",
  STATUS: "Trạng thái",
  DESCRIPTION: "Mô tả",
  CONTRACT_DATE: "Ngày ký",
  CONTRACT_DURATION: "Hạn  hợp đồng",
  STATUS: "Tình trạng",
  STATUS_DANGTHUCHIEN: "Đang thực hiện",
  STATUS_VUONGMAC: "Vướng mắc",
  STATUS_QUAHAN: "Quá hạn",
  STATUS_HOANTHANH: "Hoàn thành",
  STATUS_DATHANHTOAN: "Đã thanh toán",
};

export const exportHeaderJob = {
  EXPORT_TITLE: "DANH SÁCH CÔNG VIỆC", //tiêu đề của sheet
  EXPORT_WB: "Job.xlsx", //tên file excel
  EXPORT_WS: "Job", //tên sheet
  NAME: "Công việc",
  CONTRACT: "Hợp đồng",
  JOBFIELD: "Lĩnh vực",
  USER: "Người tạo",
  JOBDATE: "Ngày làm",
  STATUS: "Trạng thái",
  DESCRIPTION: "Mô tả",
};

export const exportHeaderInquiry = {
  EXPORT_TITLE: "DANH SÁCH NHU CẦU", //tiêu đề của sheet
  EXPORT_WB: "Inquiry.xlsx", //tên file excel
  EXPORT_WS: "Inquiry", //tên sheet
  ID: "TT",
  CUSTOMER: "Tên Doanh nghiệp",
  CUSTOMER_TYPE: "Loại hình",
  JOBFIELD: "Lĩnh vực",
  // CUSTOMER: "Khách hàng",
  STATUS: "Trạng thái",
  DESCRIPTION: "Mô tả",

  STATUS_TIEPXUC: "Tiếp xúc", // Sub-column for "Đang thực hiện"
  STATUS_KHAOSAT: "Khảo sát", // Sub-column for "Vướng mắc"
  STATUS_BAOGIA: "Báo giá", // Sub-column for "Quá hạn"
  STATUS_DANGTHUONGTHAO: "Đang thương thảo", // Sub-column for "Hoàn thành"
  STATUS_KHONGTHUCHIEN: "Không thực hiện", // Sub-column for "Đã thanh toán"
  STATUS_KYHOPDONG: "Ký hợp đồng", // Sub-column for "Đã hủy"
};

export const exportHeaderCustomer = {
  EXPORT_TITLE: "DANH SÁCH KHÁCH HÀNG", //tiêu đề của sheet
  EXPORT_WB: "Customer.xlsx", //tên file excel
  EXPORT_WS: "Customer", //tên sheet
  CODE: "Mã KH",
  NAME: "Tên",
  PHONE: "Số điện thoại",
  EMAIL: "Email",
  BIRTHDAY: "Ngày sinh",
  WEIGHT: "Cân nặng",
  HEIGHT: "Chiều cao",
  NHOMMAU: "Nhóm máu",
  HUYETAP: "Huyết áp",
  HEMOGLOBIN: "Lượng hemoglobin",
  LUONGMAUHIEN: "Lượng máu hiến",
  TINHTRANGBENHLY: "Tình trạng bệnh lý",
  TIENSUSDTHUOC: "Tiền sử sử dụng thuốc",
  ADDRESS: "Địa chỉ",
  STATUS: "Trạng thái",
  DUCHITIEUHIEN: "Đủ tiêu chuẩn hiến máu",
};

export const exportHeaderTask = {
  EXPORT_TITLE: "DANH SÁCH CHI TIẾT PHÂN VIỆC", //tiêu đề của sheet
  EXPORT_WB: "Task.xlsx", //tên file excel
  EXPORT_WS: "Task", //tên sheet
  NAME: "Nhiệm vụ",
  JOB: "Công việc",
  USER: "Người phụ trách",
  SEQUENCE: "Trình tự",
  PROCESSDATE: "Ngày tạo",
  DEALINE: "Ngày phải hoàn thành",
  DESCRIPTION: "Mô tả",
  WORKSTATUS: "Trạng thái xử lý",
};

export const exportHeaderMyJob = {
  EXPORT_TITLE: "DANH SÁCH NHIỆM VỤ", //tiêu đề của sheet
  EXPORT_WB: "MyJob.xlsx", //tên file excel
  EXPORT_WS: "MyJob", //tên sheet
  NAME: "Nhiệm vụ",
  JOB: "Công việc",
  USER: "Người phụ trách",
  SEQUENCE: "Trình tự",
  PROCESSDATE: "Ngày tạo",
  DEALINE: "Ngày phải hoàn thành",
  DESCRIPTION: "Mô tả",
  WORKSTATUS: "Trạng thái xử lý",
};

export const exportHeaderBlood = {
  EXPORT_TITLE: "DANH SÁCH NHẬP XUẤT MÁU", //tiêu đề của sheet
  EXPORT_WB: "Blood.xlsx", //tên file excel
  EXPORT_WS: "Blood", //tên sheet

  TRANSACTIONCODE: "Mã giao dịch",
  TRANSACTIONDATE: "Ngày giao dịch",
  BLOODTYPE: "Loại giao dịch",
  BLOODNAME: "Nhóm máu",
  QTY: "Số lượng máu(ml)",
  HOSPITAL: "Bệnh viện",
  STATUS: "Trạng thái",
};
