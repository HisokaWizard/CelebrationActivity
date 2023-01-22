export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User unatorized');
  }

  static BadRequest(message: string, errors?: string[]) {
    return new ApiError(400, message, errors);
  }
}
