import {
  GET_LIST_HOSPITAL,
  GET_ALL_HOSPITAL,
  CREATE_HOSPITAL,
  GET_DETAIL_HOSPITAL,
  UPDATE_HOSPITAL,
  DELETE_HOSPITAL,
} from "../constants/api";
import request from "./request";

class HospitalService {
  static async getListHospital(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_HOSPITAL.path,
          method: GET_LIST_HOSPITAL.method,
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

  static async getAllHospital(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_HOSPITAL.path,
          method: GET_ALL_HOSPITAL.method,
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

  static async addHospital(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_HOSPITAL.path,
          method: CREATE_HOSPITAL.method,
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

  static async detailHospital(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_HOSPITAL.method,
          path: GET_DETAIL_HOSPITAL.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateHospital(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_HOSPITAL.method,
          path: UPDATE_HOSPITAL.path + "/" + data?.id,
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

  static async deleteHospital(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_HOSPITAL.method,
          path: DELETE_HOSPITAL.path + "/" + data?.id,
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

export default HospitalService;
