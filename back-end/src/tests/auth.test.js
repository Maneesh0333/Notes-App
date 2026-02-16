// ✅ Mock email sending BEFORE app is imported
jest.mock("../EmailVerify/verifyMail.js", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({ messageId: "mocked" }),
}));

import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config({ path: ".env" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "test",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully...");
  });

  it("should login user and return tokens", async () => {
    // Manually verify the user
    await User.updateOne({ email: "test@example.com" }, { isVerified: true });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userdata.accessToken).toBeDefined();
    expect(res.body.userdata.refreshToken).toBeDefined();
    expect(res.body.userdata.user.email).toBe("test@example.com");
  });
});
