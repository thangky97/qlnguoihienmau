export interface IResponse {
  data?: any;
  error?: string,
  isSuccess: boolean
}

class Response {
  data?: any;
  error?: string;
  isSuccess: boolean;

  constructor({ data, error, isSuccess }: IResponse) {
    this.data = data || null
    this.error = error || ""
    this.isSuccess = isSuccess
  }
}

export default Response