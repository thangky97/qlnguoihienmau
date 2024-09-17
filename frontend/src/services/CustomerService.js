import {
  ADD_CUSTOMER,
  GET_CUSTOMER,
  LIST_CUSTOMER,
  UPDATE_CUSTOMER,
  ALL_CUSTOMER,
  CREATE_CUTOMER,
  DELETE_CUSTOMER,
} from "../constants/api";
import request from "./request";
class CustomerService {
  static async getListCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: LIST_CUSTOMER.path,
          method: LIST_CUSTOMER.method,
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

  static async getAllCustomer(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: ALL_CUSTOMER.path,
          method: ALL_CUSTOMER.method,
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

  static async addCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: ADD_CUSTOMER.path,
          method: ADD_CUSTOMER.method,
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

  static async readCustomer(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_CUSTOMER.method,
          path: GET_CUSTOMER.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_CUSTOMER.method,
          path: UPDATE_CUSTOMER.path + "/" + data.code,
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
          path: CREATE_CUTOMER.path,
          method: CREATE_CUTOMER.method,
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

  static async deleteCustomer(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_CUSTOMER.method,
          path: DELETE_CUSTOMER.path,
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

export default CustomerService;
