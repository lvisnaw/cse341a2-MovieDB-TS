//npm install --save-dev jest @types/jest ts-jest
import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
};

export default config;