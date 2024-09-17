import {
  GET_LIST_WORKING_PROCESS_TEMPLATE,
  GET_ALL_WORKING_PROCESS_TEMPLATE,
  CREATE_WORKING_PROCESS_TEMPLATE,
  GET_DETAIL_WORKING_PROCESS_TEMPLATE,
  UPDATE_WORKING_PROCESS_TEMPLATE,
  DELETE_WORKING_PROCESS_TEMPLATE,
} from "../constants/api";
import request from "./request";

class WorkingprocesstemplateService {
  static async getListWorkingprocesstemplate(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_WORKING_PROCESS_TEMPLATE.path,
          method: GET_LIST_WORKING_PROCESS_TEMPLATE.method,
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

  static async getAllWorkingprocesstemplate(query) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_WORKING_PROCESS_TEMPLATE.path,
          method: GET_ALL_WORKING_PROCESS_TEMPLATE.method,
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

  static async addWorkingprocesstemplate(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: CREATE_WORKING_PROCESS_TEMPLATE.path,
          method: CREATE_WORKING_PROCESS_TEMPLATE.method,
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

  static async detailWorkingprocesstemplate(code) {
    return new Promise((resolve) => {
      request
        .send({
          method: GET_DETAIL_WORKING_PROCESS_TEMPLATE.method,
          path: GET_DETAIL_WORKING_PROCESS_TEMPLATE.path + "/" + code,
        })
        .then((res) => {
          resolve({ data: res, isSuccess: true });
        })
        .catch((res) => {
          resolve({ isSuccess: false });
        });
    });
  }

  static async updateWorkingprocesstemplate(data) {
    return new Promise((resolve) => {
      request
        .send({
          method: UPDATE_WORKING_PROCESS_TEMPLATE.method,
          path: UPDATE_WORKING_PROCESS_TEMPLATE.path + "/" + data?.id,
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

  static async deleteWorkingprocesstemplate(id) {
    return new Promise((resolve) => {
      request
        .send({
          method: DELETE_WORKING_PROCESS_TEMPLATE.method,
          path: DELETE_WORKING_PROCESS_TEMPLATE.path + "/" + id,
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

export default WorkingprocesstemplateService;
