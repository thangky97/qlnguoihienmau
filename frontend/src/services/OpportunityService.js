import {
  GET_LIST_INQUIRY,
  GET_ALL_INQUIRY,
  CREATE_INQUIRY,
  GET_DETAIL_INQUIRY,
  UPDATE_INQUIRY,
  DELETE_INQUIRY,
  UPLOAD_EXCEL_INQUIRY,
} from "../constants/api";
import request from "./request";

class OpportunityService {
  static async getList(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_INQUIRY.path,
          method: GET_LIST_INQUIRY.method,
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

  static async getAll(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_INQUIRY.path,
          method: GET_ALL_INQUIRY.method,
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

  static async add(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_INQUIRY.path,
          method: CREATE_INQUIRY.method,
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

  static async detail(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_INQUIRY.method,
          path: GET_DETAIL_INQUIRY.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async update(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_INQUIRY.method,
          path: UPDATE_INQUIRY.path + "/" + data?.id,
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

  static async delete(id) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_INQUIRY.method,
          path: DELETE_INQUIRY.path + "/" + id,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async UpLoadExcel(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPLOAD_EXCEL_INQUIRY.method,
          path: UPLOAD_EXCEL_INQUIRY.path,
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

export default OpportunityService;
