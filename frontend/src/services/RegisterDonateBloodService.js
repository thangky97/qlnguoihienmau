import {
  GET_LIST_REGISTER_DONATE_BLOOD,
  GET_ALL_REGISTER_DONATE_BLOOD,
  CREATE_REGISTER_DONATE_BLOOD,
  GET_DETAIL_REGISTER_DONATE_BLOOD,
  UPDATE_REGISTER_DONATE_BLOOD,
  DELETE_REGISTER_DONATE_BLOOD,
} from "../constants/api";
import request from "./request";

class RegisterDonateBloodService {
  static async getListRegisterDonateBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_REGISTER_DONATE_BLOOD.path,
          method: GET_LIST_REGISTER_DONATE_BLOOD.method,
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

  static async getAllRegisterDonateBlood(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_REGISTER_DONATE_BLOOD.path,
          method: GET_ALL_REGISTER_DONATE_BLOOD.method,
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

  static async addRegisterDonateBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_REGISTER_DONATE_BLOOD.path,
          method: CREATE_REGISTER_DONATE_BLOOD.method,
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

  static async detailRegisterDonateBlood(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_REGISTER_DONATE_BLOOD.method,
          path: GET_DETAIL_REGISTER_DONATE_BLOOD.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateRegisterDonateBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_REGISTER_DONATE_BLOOD.method,
          path: UPDATE_REGISTER_DONATE_BLOOD.path + "/" + data?.id,
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

  static async deleteRegisterDonateBlood(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_REGISTER_DONATE_BLOOD.method,
          path: DELETE_REGISTER_DONATE_BLOOD.path + "/" + data?.id,
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

export default RegisterDonateBloodService;
