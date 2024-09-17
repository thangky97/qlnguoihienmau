import {
  GET_LIST_JOBFIELD,
  GET_ALL_JOBFIELD,
  CREATE_JOBFIELD,
  GET_DETAIL_JOBFIELD,
  UPDATE_JOBFIELD,
  DELETE_JOBFIELD,
  GET_ALL_STATISTICAL,
  GET_ALL_STATISTICAL_JOB,
} from "../constants/api";
import request from "./request";

class JobfieldService {
  static async getList(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_JOBFIELD.path,
          method: GET_LIST_JOBFIELD.method,
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

  static async Statistical(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_STATISTICAL.path,
          method: GET_ALL_STATISTICAL.method,
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

  static async Statisticaljob(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_STATISTICAL_JOB.path,
          method: GET_ALL_STATISTICAL_JOB.method,
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

  static async getAll(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_JOBFIELD.path,
          method: GET_ALL_JOBFIELD.method,
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
          path: CREATE_JOBFIELD.path,
          method: CREATE_JOBFIELD.method,
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
          method: GET_DETAIL_JOBFIELD.method,
          path: GET_DETAIL_JOBFIELD.path + "/" + code,
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
          method: UPDATE_JOBFIELD.method,
          path: UPDATE_JOBFIELD.path + "/" + data?.id,
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

  static async deleteJobfield(id) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_JOBFIELD.method,
          path: DELETE_JOBFIELD.path + "/" + id,
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

export default JobfieldService;
