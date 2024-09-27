import {
  ADD_BLOOD,
  GET_BLOOD,
  LIST_BLOOD,
  UPDATE_BLOOD,
  // UPLOAD_EXCEL_MATERIAL,
} from "../constants/api";
import request from "./request";

class BloodService {
  static async getListBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: LIST_BLOOD.path,
          method: LIST_BLOOD.method,
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

  static async addBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: ADD_BLOOD.path,
          method: ADD_BLOOD.method,
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

  static async readBlood(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_BLOOD.method,
          path: GET_BLOOD.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_BLOOD.method,
          path: UPDATE_BLOOD.path + "/" + data?.transactionCodes,
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

  // static async UpLoadExcel(data) {
  //   return new Promise((resolve) => {
  //     request
  //       .send({
  //         method: UPLOAD_EXCEL_MATERIAL.method,
  //         path: UPLOAD_EXCEL_MATERIAL.path,
  //         data,
  //       })
  //       .then((res) => {
  //         resolve({ data: res, isSuccess: true });
  //       })
  //       .catch((res) => {
  //         resolve({ isSuccess: false });
  //       });
  //   });
  // }
}

export default BloodService;
