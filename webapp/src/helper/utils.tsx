import { toast, TypeOptions, ToastOptions } from "react-toastify";

const Utils = {
  /**
   * Build url with params
   */
  buildUrlWithParams(url: string, params: any, removeEncode?: boolean) {
    let ret = "";
    url += "?";
    for (const d in params) {
      if (params[d] !== undefined || params[d] === 0) {
        if (removeEncode) {
          ret += `${d}=${params[d]}&`;
        } else {
          ret += `${encodeURIComponent(d)}=${encodeURIComponent(params[d])}&`;
        }
      }
    }

    ret = ret.replace(/&$/, "");

    return url + ret;
  },
  /**
   * Check is valid Url
   */
  isURL(str: string) {
    var pattern = new RegExp(
      "^((ft|htt)ps?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?" + // port
        "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
        "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return pattern.test(str);
  },
  getMoneyByLang(lang: string) {
    let money;
    if (lang == "vn") {
      money = "VND";
    } else if (lang == "jp") {
      money = "円";
    } else {
      money = "$";
    }
    return money;
  },
  //Convert phone number
  convertPhoneNumber(phoneNumber: string) {
    const areaCode = "84";
    let checkareaCode = phoneNumber.substring(0, 2);
    let checkZero = phoneNumber.substring(0, 1);
    if (checkareaCode === areaCode) {
      return phoneNumber;
    } else if (checkZero === "0") {
      return areaCode + phoneNumber.substring(1, phoneNumber.length);
    } else {
      return areaCode + phoneNumber;
    }
  },
  convertFileToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  },
  capitalizeFirstLetter(stringText: string) {
    return stringText.charAt(0).toUpperCase() + stringText.slice(1);
  },
  getParameterByName(name: string, url?: string) {
    if (!url) url = "";
    // eslint-disable-next-line
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  isEquivalent(a: string, b: string) {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      // If values of same property are not equal,
      // objects are not equivalent
      // @ts-ignore
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
  },
  vietnamese(str: string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  },
  number_to_price(v: any) {
    if (v === 0) {
      return "0";
    }

    if (!v || v === "") {
      return v;
    }
    v = v.toString();

    v = v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    v = v.split(",").join("*").split(".").join(",").split("*").join(".");
    return v;
  },
  price_to_number(v: any) {
    if (!v) {
      return 0;
    }
    v = v.split(",").join("");
    v = v.split(".").join(",");

    return Number(v);
  },
  validateEmail(email: string) {
    // eslint-disable-next-line
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  validatePass(pass: string) {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passw.test(pass);
  },
  onRedirect(path: any, cb: (newPath: string) => void, redirect?: boolean) {
    if (!path) return;

    if (path.includes("#")) {
      if (window.location.pathname !== "/") {
        cb("/");
      }
      setTimeout(() => {
        if (!redirect) {
          if (window.location.hash) {
            window.location.hash = "";
          }
          let elementPos = document.querySelector(path).offsetTop;
          document.body.scrollTo({
            top: elementPos,
            behavior: "smooth"
          });
        } else {
          window.location.hash = path;
        }
      }, 100);
    } else {
      cb(path);
      setTimeout(() => {
        document.body.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 300);
    }
  },
  jsUcfirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

export function Toast(
  type: TypeOptions,
  content: string,
  option?: ToastOptions
) {
  // @ts-ignore
  toast[type](content, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    ...option
  });
}

export default Utils;
