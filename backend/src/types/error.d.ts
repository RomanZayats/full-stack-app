export interface ErrorResponse {
  status: 'error';
  message: string;
  details?: unknown;
}
