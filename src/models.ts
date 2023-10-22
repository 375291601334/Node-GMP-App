export interface ResponseBody<T> {
  data: T | null;
  error: { message: string } | null;
}
