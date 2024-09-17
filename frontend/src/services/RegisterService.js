import {
  REGISTER_CREATE_COMPANY,
  REGISTER_VALIDATE,
  SIGN_UP_CUSTOMER,
} from "../constants/api";
import request from "./request";
class RegisterService {
  static async signUpCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: SIGN_UP_CUSTOMER.path,
          method: SIGN_UP_CUSTOMER.method,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }
  static async registerValidate(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: REGISTER_VALIDATE.path,
          method: REGISTER_VALIDATE.method,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }
  static async addCompany(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: REGISTER_CREATE_COMPANY.path,
          method: REGISTER_CREATE_COMPANY.method,
          data,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }
}

export default RegisterService;
