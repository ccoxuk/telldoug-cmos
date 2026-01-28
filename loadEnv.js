import fs from "fs";

if (fs.existsSync("env.json")) {
  const envConfig = JSON.parse(fs.readFileSync("env.json", "utf8"));
  Object.keys(envConfig).forEach((key) => {
    if (!process.env[key]) {
      process.env[key] = envConfig[key];
    }
  });
}
