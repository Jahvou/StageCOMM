const { expect } = require('chai');
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });


const app = require("../src/app");

describe("Auth Routes", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async () => {
    await mongoose.connection.collection('users').deleteMany({ email: /test/ });
    await mongoose.disconnect();
  });
  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "testauth@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("email", "testauth@test.com");
    });

    it("should not register a user with a duplicate email", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "dupe@test.com",
          password: "123456",
        });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "dupe@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Email already in use");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "testauth@test.com", password: "123456" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "testauth@test.com", password: "wrongpassword" });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Invalid email or password");
    });
  });
});
