import {
  GET_FIND_COUNT_JOB,
  GET_FIND_COUNT_TASK,
  GET_FIND_TASK,
  GET_FIND_JOB,
} from "../constants/api";
import request from "./request";
class OrderService {
  //api thống kê
  static async getFindCountTask(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_FIND_COUNT_TASK.path,
          method: GET_FIND_COUNT_TASK.method,
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

  static async getFindTask(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_FIND_TASK.path,
          method: GET_FIND_TASK.method,
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

  static async getFindCountJob(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_FIND_COUNT_JOB.path,
          method: GET_FIND_COUNT_JOB.method,
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

  static async getFindJob(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_FIND_JOB.path,
          method: GET_FIND_JOB.method,
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

export default OrderService;
