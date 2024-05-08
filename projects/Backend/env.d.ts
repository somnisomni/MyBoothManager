declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TRUST_LOCALHOST_PROXY?: string,

      API_SERVER_HOST?: string,
      API_SERVER_PORT?: string,
      JWT_SECRET?: string,
      SUPERADMIN_ID?: string,
      SUPERADMIN_PASS?: string,

      FILE_UPLOAD_FOLDER?: string,

      MYSQL_HOST?: string,
      MYSQL_PORT?: string,
      MYSQL_USER?: string,
      MYSQL_PASSWORD?: string,
      MYSQL_DATABASE?: string,
      SEQUELIZE_TIMEZONE?: string,
      ENABLE_SEQUELIZE_LOGGING?: string,

      COOKIE_SECRET?: string,

      FRONTEND_ADMIN_URL?: string,
      FRONTEND_PUBLIC_URL?: string,
    }
  }
}

export { };
