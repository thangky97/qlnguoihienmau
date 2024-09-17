import {
  CREATE_JOB,
  GET_DETAIL_JOB,
  GET_ALL_JOB,
  UPDATE_JOB,
  DELETE_JOB,
} from "../constants/api";
import request from "./request";
class JobService {
  static async getListJob(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_JOB.path,
          method: GET_ALL_JOB.method,
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

  static async getAllJob(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_JOB.path,
          method: GET_ALL_JOB.method,
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

  static async addJob(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_JOB.path,
          method: CREATE_JOB.method,
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

  static async detailJob(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_JOB.method,
          path: GET_DETAIL_JOB.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateJob(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_JOB.method,
          path: UPDATE_JOB.path + "/" + data.id,
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

  static async deleteJob(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_JOB.method,
          path: DELETE_JOB.path,
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

export default JobService;
