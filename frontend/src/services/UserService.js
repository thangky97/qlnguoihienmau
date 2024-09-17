import api, {
  ADD_CUTOMER,
  ADD_USER,
  DELETE_USER,
  GET_ALL_CUSTOMER,
  GET_ALL_OPERATOR,
  GET_ALL_STAFF,
  GET_PROFILE,
  GET_USER,
  LIST_USER,
  UPDATE_PROFILE,
  UPDATE_USER,
} from "../constants/api";
import request from "./request";
class UserService {
  static async getListUser(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: LIST_USER.path,
          method: LIST_USER.method,
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
  static async getProfile(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_PROFILE.path,
          method: GET_PROFILE.method,
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

  static async addUser(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: ADD_USER.path,
          method: ADD_USER.method,
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
  static async addCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: ADD_CUTOMER.path,
          method: ADD_CUTOMER.method,
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

  static async readUser(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_USER.method,
          path: GET_USER.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateUser(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_USER.method,
          path: UPDATE_USER.path + "/" + data.code,
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

  static async updateprofile(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_PROFILE.method,
          path: UPDATE_PROFILE.path,
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

  static async get_all_operator(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_ALL_OPERATOR.method,
          path: GET_ALL_OPERATOR.path,
          query,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }
  static async get_all_customer(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_ALL_CUSTOMER.method,
          path: GET_ALL_CUSTOMER.path,
          query,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async get_all_staff(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_ALL_STAFF.method,
          path: GET_ALL_STAFF.path,
          query,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async deleteUser(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_USER.method,
          path: DELETE_USER.path,
          query,
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

export default UserService;
