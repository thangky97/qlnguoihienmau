import {
  GET_LIST_BRANCH,
  GET_ALL_BRANCH,
  CREATE_BRANCH,
  GET_DETAIL_BRANCH,
  UPDATE_BRANCH,
  DELETE_BRANCH,
} from "../constants/api";
import request from "./request";

class BranchService {
  static async getList(data) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_LIST_BRANCH.path,
          method: GET_LIST_BRANCH.method,
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

  static async getAll(query = {}) {
    return new Promise((resolve) => {
      request
        .send({
          path: GET_ALL_BRANCH.path,
          method: GET_ALL_BRANCH.method,
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
          path: CREATE_BRANCH.path,
          method: CREATE_BRANCH.method,
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
          method: GET_DETAIL_BRANCH.method,
          path: GET_DETAIL_BRANCH.path + "/" + code,
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
          method: UPDATE_BRANCH.method,
          path: UPDATE_BRANCH.path + "/" + data?.id,
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
          method: DELETE_BRANCH.method,
          path: DELETE_BRANCH.path + "/" + id,
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

export default BranchService;
