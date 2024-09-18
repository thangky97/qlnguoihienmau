import {
  GET_LIST_ENVENT,
  GET_ALL_ENVENT,
  CREATE_ENVENT,
  GET_DETAIL_ENVENT,
  UPDATE_ENVENT,
  DELETE_ENVENT,
} from "../constants/api";
import request from "./request";

class EnventServiceService {
  static async getListEnvent(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_ENVENT.path,
          method: GET_LIST_ENVENT.method,
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

  static async getAllEnvent(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_ENVENT.path,
          method: GET_ALL_ENVENT.method,
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

  static async addEnvent(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_ENVENT.path,
          method: CREATE_ENVENT.method,
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

  static async detailEnvent(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_ENVENT.method,
          path: GET_DETAIL_ENVENT.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateEnvent(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_ENVENT.method,
          path: UPDATE_ENVENT.path + "/" + data?.id,
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

  static async deleteEnvent(id) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_ENVENT.method,
          path: DELETE_ENVENT.path + "/" + id,
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

export default EnventServiceService;
