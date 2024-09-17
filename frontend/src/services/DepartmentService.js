import {
  GET_LIST_DEPARTMENT,
  GET_ALL_DEPARTMENT,
  CREATE_DEPARTMENT,
  GET_DETAIL_DEPARTMENT,
  UPDATE_DEPARTMENT,
  STATISTIC_DEPARTMENT_JOB,
  STATISTIC_DEPARTMENT_TASK,
  REPORT_TASK,
  DELETE_DEPARTMENT,
} from "../constants/api";
import request from "./request";

class DepartmentService {
  static async getListDepartment(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_DEPARTMENT.path,
          method: GET_LIST_DEPARTMENT.method,
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
  static async getStatisticDepartmentJob(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: STATISTIC_DEPARTMENT_JOB.path,
          method: STATISTIC_DEPARTMENT_JOB.method,
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

  static async getStatisticDepartmentTask(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: STATISTIC_DEPARTMENT_TASK.path,
          method: STATISTIC_DEPARTMENT_TASK.method,
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

  static async ReportTask(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: REPORT_TASK.path,
          method: REPORT_TASK.method,
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

  static async getAllDepartment(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_DEPARTMENT.path,
          method: GET_ALL_DEPARTMENT.method,
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

  static async addDepartment(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_DEPARTMENT.path,
          method: CREATE_DEPARTMENT.method,
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

  static async detailDepartment(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_DEPARTMENT.method,
          path: GET_DETAIL_DEPARTMENT.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateDepartment(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_DEPARTMENT.method,
          path: UPDATE_DEPARTMENT.path + "/" + data?.id,
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

  static async deleteDepartment(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_DEPARTMENT.method,
          path: DELETE_DEPARTMENT.path + "/" + data?.id,
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

export default DepartmentService;
