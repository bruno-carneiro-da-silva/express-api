export type Errors = {
  error: {
    name: string;
    code: string;
    clientVersion: number;
    meta: {
      modelName: string;
      field_name: string;
    };
  };
};
