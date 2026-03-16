export interface AppJwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
