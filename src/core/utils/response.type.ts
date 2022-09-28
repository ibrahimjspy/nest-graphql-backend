export type SuccessResponseType = {
  status: number;
  message?: string;
  data: any;
};

export type FailedResponseType = {
  status: number;
  message: string;
  errors?: Array<any>;
};
