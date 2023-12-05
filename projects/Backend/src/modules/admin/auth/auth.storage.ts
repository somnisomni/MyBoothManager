export default class AuthStorage {
  // refresh token UUID memory storage
  static readonly REFRESH_UUID_STORE: Map<number, string> = new Map();

  // auth JWT token memory storage
  static readonly AUTH_TOKEN_STORE: Map<number, string> = new Map();
}
