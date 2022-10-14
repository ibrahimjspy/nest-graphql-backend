export interface SuccessResponseType {
  status: number;
  message?: string;
  data: any;
}

export interface FailedResponseType {
  status: number;
  message: string;
  errors?: Array<any>;
}
