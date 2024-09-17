import {
  GET_LIST_CONTRACT,
  GET_ALL_CONTRACT,
  CREATE_CONTRACT,
  GET_DETAIL_CONTRACT,
  UPDATE_CONTRACT,
  UPLOAD_EXCEL_CONTRACT,
  DELETE_CONTRACT,
  GET_JOB_CONTRACT,
  UPDATE_CONTRACT_TASKS_STATUS,
} from "../constants/api";
import request from "./request";

class ContractService {
  static async getListContract(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_CONTRACT.path,
          method: GET_LIST_CONTRACT.method,
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

  static async getAllContract(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_CONTRACT.path,
          method: GET_ALL_CONTRACT.method,
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

  static async addContract(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_CONTRACT.path,
          method: CREATE_CONTRACT.method,
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

  static async detailContract(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_CONTRACT.method,
          path: GET_DETAIL_CONTRACT.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async getJobcontract(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_JOB_CONTRACT.method,
          path: GET_JOB_CONTRACT.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateContract(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_CONTRACT.method,
          path: UPDATE_CONTRACT.path + "/" + data?.id,
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

  static async UpLoadExcel(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPLOAD_EXCEL_CONTRACT.method,
          path: UPLOAD_EXCEL_CONTRACT.path,
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

  static async deleteContract(query) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_CONTRACT.method,
          path: DELETE_CONTRACT.path,
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


  static async updateTasksStatus(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_CONTRACT_TASKS_STATUS.method,
          path: UPDATE_CONTRACT_TASKS_STATUS.path,
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

export default ContractService;
