export interface UseCase<Request = any, Response = any> {
  execute(request: Request): Response;
}
