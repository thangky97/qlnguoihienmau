import {
  GET_DETAIL_COMPANY,
  UPDATE_COMPANY,
  GET_ALL_COMPANY,
  GET_LIST_COMPANY,
  CREATE_COMPANY,
  GET_LIST_COMPANY_CUSTOMER,
  DELETE_COMPANY,
} from "../constants/api";
import request from "./request";

class CompanyService {
  static async getListCompany(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_COMPANY.path,
          method: GET_LIST_COMPANY.method,
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

  static async getListCompanyCustomer(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_COMPANY_CUSTOMER.path,
          method: GET_LIST_COMPANY_CUSTOMER.method,
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

  static async getAllCompany() {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_COMPANY.path,
          method: GET_ALL_COMPANY.method,
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
          path: CREATE_COMPANY.path,
          method: CREATE_COMPANY.method,
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

  static async detailCompany(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_COMPANY.method,
          path: GET_DETAIL_COMPANY.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateCompany(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_COMPANY.method,
          path: UPDATE_COMPANY.path + "/" + data?.id,
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

  static async deleteCompany(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_COMPANY.method,
          path: DELETE_COMPANY.path,
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

export default CompanyService;
