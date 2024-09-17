import {
  CREATE_TASK,
  GET_DETAIL_TASK,
  GET_ALL_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_ALL_TASK_BY_IDCONTRACT,
} from "../constants/api";
import request from "./request";
class TaskService {
  static async getListTask(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_TASK.path,
          method: GET_ALL_TASK.method,
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

  static async getAllTask(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_TASK.path,
          method: GET_ALL_TASK.method,
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
  static async getAllTaskByContact(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_TASK_BY_IDCONTRACT.path,
          method: GET_ALL_TASK_BY_IDCONTRACT.method,
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
  static async addTask(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_TASK.path,
          method: CREATE_TASK.method,
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

  static async detailTask(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_TASK.method,
          path: GET_DETAIL_TASK.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateTask(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_TASK.method,
          path: UPDATE_TASK.path + "/" + data.id,
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
          method: DELETE_TASK.method,
          path: DELETE_TASK.path + "/" + id,
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

export default TaskService;
