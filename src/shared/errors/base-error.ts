export class BaseError extends Error {
  code: number;

  constructor({ message, code }: BaseErrorProps) {
    super(message);
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export type BaseErrorProps = {
  message: string;
  code: number;
};
