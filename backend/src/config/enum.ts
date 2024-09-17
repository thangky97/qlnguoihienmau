export enum Role {
  STAFF = 'STAFF',
  OPERATOR = 'OPERATOR',
  ACCOUNTANT = 'ACCOUNTANT',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  HDV = 'HDV',
  COMPANYADMIN = 'COMPANYADMIN',
  AGENT = 'AGENT',
  MANAGER = 'MANAGER',
  DEPUTY = 'DEPUTY',
  PRESIDENT = 'PRESIDENT',
  VICPRESIDENT = 'VICPRESIDENT',
}

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
}

export enum SourceIntroduction {
  FB = 'FB',
  ZALO = 'ZALO',
  PHONE = 'PHONE',
  GT = 'GT',
  QC = 'QC',
  KHC = 'KHC',
}
export enum Typemkt {
  FB = 'FB',
  ZALO = 'ZALO',
  EMAIL = 'EMAIL',
}

export enum RunStatus {
  Run = 'Run',
  NORUN = 'NORUN',
}

export enum BrowsingStatus {
  Run = 'Run',
  NORUN = 'NORUN',
}
export enum Status {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

export enum TypePromissory {
  NCC = 'NCC',
  KH = 'KH',
  NB = 'NB',
}

export enum TravelType {
  GROUPTOUR = 'GROUPTOUR',
  TOURGRAFT = 'TOURGRAFT',
  COMBO = 'COMBO',
  SENDTOUR = 'SENDTOUR',
}
export enum SaleStatus {
  NEWCREATE = 'NEWCREATE',
  OPENSELL = 'OPENSELL',
  STOPSELLING = 'STOPSELLING',
}

export enum OperatingStatus {
  OPERATING = 'OPERATING',
  UNOPERATING = 'UNOPERATING',
}

export enum TypeDocument {
  FILE = 'FILE',
  CONTRACT = 'CONTRACT',
  VISA = 'VISA',
  OTHER = 'OTHER',
}

export enum Verify {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum Management {
  USER = 'USER',
  TOUR = 'TOUR',
  ORDER = 'ORDER',
  OPERATING = 'OPERATING',
  PAYMENT = 'PAYMENT',
  MESSAGE = 'MESSAGE',
  SUPPLIER = 'SUPPLIER',
  SUPPLIERMATERIAL = 'SUPPLIERMATERIAL',
  ORDERCUSTOMERLIST = 'ORDERCUSTOMERLIST',
  MATERIALBALANCE = 'MATERIALBALANCE',
  MATERIALTRANSACTION = 'MATERIALTRANSACTION',
  MATERIALTRANSACTIONDETAIL = 'MATERIALTRANSACTIONDETAIL',
  AIRTICKERBOOKING = 'AIRTICKERBOOKING',
  HOTELBOOKING = 'HOTELBOOKING',
  VISABOOKING = 'VISABOOKING',
  ROOMSETUP = 'ROOMSETUP',
  REPORT = 'REPORT',
  DOCUMENTS = 'DOCUMENTS',
  MANAGER = 'MANAGER',
  DEPUTY = 'DEPUTY',
  PRESIDENT = 'PRESIDENT',
  VICPRESIDENT = 'VICPRESIDENT',
  INQUIRY = 'INQUIRY',
  CONTRACT = 'CONTRACT',
  JOB = 'JOB',
  WORKINGPROCESSTEMPLATE = 'WORKINGPROCESSTEMPLATE',
  CATEGORY = 'CATEGORY',
}

export enum Category {
  DOMESTIC = 'DOMESTIC',
  INTERNATIONAL = 'INTERNATIONAL',
}

export enum ProcessingStatus {
  CONTACT = 'CONTACT',
  Survey = 'Survey',
  NEGOTIATION = 'NEGOTIATION',
  SURNOTIMPLEMENTEDVEY = 'SURNOTIMPLEMENTEDVEY',
  CONTRACT = 'CONTRACT',
}

export enum inquiryProcessingStatus {
  tiepXuc = 'tiepXuc',
  khaoSat = 'khaoSat',
  baoGia = 'baoGia',
  dangThuongThao = 'dangThuongThao',
  khongThucHien = 'khongThucHien',
  kyHD = 'kyHD',
}

export enum Age {
  INFANT = 'INFANT',
  CHILDREN = 'CHILDREN',
  ADULT = 'ADULT',
}

export enum ProductType {
  TICKET = 'TICKET',
  LAND = 'LAND',
  TOUR = 'TOUR',
}

export enum OrderStatus {
  HOLD = 'HOLD',
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
}

export enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  TWONDPAYMENT = 'TWONDPAYMENT',
  THREERDPAYMENT = 'THREERDPAYMENT',
  FOURTHPAYMENT = 'FOURTHPAYMENT',
}

export enum SortType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum StatusPurchaseOrder {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum StatusPurchaseDetail {
  CREATED = 'CREATED',
  RECEIVED = 'RECEIVED',
}

export enum VisaType {
  LE = 'LE',
  DOAN = 'DOAN',
}

export enum AirticketBookingType {
  SERIES = 'SERIES',
  ADHOC = 'ADHOC',
  VELE = 'VELE',
}

export enum StatusHotel {
  REQUEST = 'REQUEST',
  CONFIRMED = 'CONFIRMED',
  CANCEL = 'CANCEL',
}

export enum KindRoom {
  SINGLE = 'SINGLE',
  TWIN = 'TWIN',
  DOUBLE = 'DOUBLE',
  Triple = 'TRIPLE',
}

export enum WorkStatus {
  ONTIME = 'ONTIME',
  DELAY = 'DELAY',
}

export enum WorkStatusTask {
  NOPROCESS = 'NOPROCESS',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCEL = 'CANCEL',
}
export enum WorkStatusJob {
  NOPROCESS = 'NOPROCESS',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}
export enum StatusContract {
  NEW = 'NEW',
  INPROCESS = 'INPROCESS',
  COMPLETED = 'COMPLETED',
}
export enum ProgressStatus {
  ON_TIME = 'Đúng hạn',
  LATE = 'Quá hạn',
}
