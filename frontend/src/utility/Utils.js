import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import moment from "moment";
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (
//   value,
//   formatting = { month: "short", day: "numeric", year: "numeric" }
// ) => {
//   if (!value) return value;
//   return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
// };
// export const formatDateTime(dateTime) =>{
//   var momentDate = moment(proposedDate);
//   return momentDate.utc().format("YYYY-MM-DD HH:mm:ss");
// }
export const formatDateTime = (dateTime) => {
  let momentDate = moment(dateTime);
  return momentDate.format("HH:mm:ss DD-MM-YYYY ");
};
export const formatDate = (dateTime) => {
  let momentDate = moment(dateTime);
  return momentDate.format("DD-MM-YYYY");
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("accessToken");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return "/";
  if (userRole === "user") return "/access-control";
  return "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "black1a", // for option hover bg-color
    primary: "black", // for selected option bg-color
    neutral10: "black", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});
export const htmlToDraftUtil = (draftContent) => {
  const blocksFromHtml = htmlToDraft(draftContent);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const editorState = EditorState.createWithContent(contentState);
  return editorState;
};

export const removeVietnameseTones = (str) => {
  str = str?.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str?.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str?.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str?.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str?.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str?.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str?.replace(/đ/g, "d");
  str = str?.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str?.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str?.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str?.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str?.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str?.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str?.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str?.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str?.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str?.replace(/ + /g, " ");
  str = str?.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str?.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
};
export const formatText = (text) => {
  return removeVietnameseTones(text)?.toLowerCase();
};
// export const formatCurrency = (currency) => {
//   const tempCurrency = +currency;
//   return tempCurrency.toLocaleString("it-IT", {
//     style: "currency",
//   });
// };
export const formatCurrency = (currency) => {
  const tempCurrency = +currency;
  return tempCurrency.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};
export const formatCurrencys = (currency) => {
  const tempCurrency = +currency;
  const a = tempCurrency.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
  const b = a.slice(0, a.indexOf("VND"));
  return b;
};

export const checkauth = (role, auth, permission) => {
  if (role == "ADMIN") {
    return true;
  } else if (role == "CUSTOMER") {
    return false;
  } else {
    if (auth?.includes(permission)) {
      return true;
    } else {
      return false;
    }
  }
};

export const addCommas = (number) => {
  // Chuyển số thành chuỗi
  const numberString = number.toString();
  const parts = numberString.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Sử dụng biểu thức chính quy để thêm dấu chấm sau mỗi 3 đơn vị trong phần nguyên
  const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Kết hợp phần nguyên đã có dấu chấm và phần thập phân (nếu có)
  const result = integerWithCommas + decimalPart;

  return result;
};

export function calculateRemainingValue(targetDate) {
  // Current date
  const currentDate = new Date();

  // Target date (converting the date string to a Date object)
  const targetDateObj = new Date(targetDate);

  // Calculate remaining milliseconds between current date and target date
  const remainingMilliseconds = targetDateObj.getTime() - currentDate.getTime();

  // If remaining milliseconds are greater than or equal to 1 day
  if (remainingMilliseconds >= 1000 * 3600 * 24) {
    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 3600 * 24));
    return remainingDays + " ngày";
  } else if (remainingMilliseconds >= 1000 * 3600) {
    // If remaining milliseconds are greater than or equal to 1 hour
    const remainingHours = Math.ceil(remainingMilliseconds / (1000 * 3600));
    return remainingHours + " giờ";
  } else {
    // If remaining milliseconds are less than 1 hour
    const remainingMinutes = Math.ceil(remainingMilliseconds / (1000 * 60));
    return remainingMinutes + " phút";
  }
}
