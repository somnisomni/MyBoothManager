import generateConfig from "../config";

const testEnvVars = {
  MYSQL_HOST: "localhost",
  MYSQL_PORT: "8888",
  MYSQL_USER: "test",
  MYSQL_PASSWORD: "test",
  MYSQL_DATABASE: "testdb",
  SEQUELIZE_TIMEZONE: "+09:00",
};

describe("DB Config", () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      ...testEnvVars,
    };
  });

  it("should throw error when process.env values are missing", () => {
    process.env = {};

    expect(() => generateConfig()).toThrow(Error);
  });

  it("should return a valid config with process.env values", () => {
    const config = generateConfig();

    expect(config).toBeInstanceOf(Object);
    expect(config).toHaveProperty("dialect", "mysql");
    expect(config).toHaveProperty("host", testEnvVars.MYSQL_HOST);
    expect(config).toHaveProperty("port", Number(testEnvVars.MYSQL_PORT));
    expect(config).toHaveProperty("username", testEnvVars.MYSQL_USER);
    expect(config).toHaveProperty("password", testEnvVars.MYSQL_PASSWORD);
    expect(config).toHaveProperty("database", testEnvVars.MYSQL_DATABASE);
    expect(config).toHaveProperty("timezone", testEnvVars.SEQUELIZE_TIMEZONE);
  });
});
