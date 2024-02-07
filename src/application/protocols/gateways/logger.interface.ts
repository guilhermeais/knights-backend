export abstract class Logger {
  abstract info(ctx: string, message: string): void;
  abstract error(ctx: string, message: string): void;
  abstract warn(ctx: string, message: string): void;
  abstract debug(ctx: string, message: string): void;
}
