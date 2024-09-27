import {
  GET_BLOOD_DETAIL,
  UPDATE_BLOOD_DETAIL,
  LIST_BLOOD_DETAIL,
  ADD_BLOOD_DETAIL,
  DELETE_BLOOD_DETAIL,
} from "../constants/api";
import request from "./request";

class BloodDetailService {
  static async getListBloodDetail(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: LIST_BLOOD_DETAIL.path,
          method: LIST_BLOOD_DETAIL.method,
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

  static async addBloodDetail(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: ADD_BLOOD_DETAIL.path,
          method: ADD_BLOOD_DETAIL.method,
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

  static async readBloodDetail(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_BLOOD_DETAIL.method,
          path: GET_BLOOD_DETAIL.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateBloodDetail(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_BLOOD_DETAIL.method,
          path: UPDATE_BLOOD_DETAIL.path + "/" + data.id,
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

  static async deleteBloodDetail(id) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_BLOOD_DETAIL.method,
          path: DELETE_BLOOD_DETAIL.path + "/" + id,
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

export default BloodDetailService;
