import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "./app";
import type { Express } from "express";

describe("TODO 1: POST /deposit", () => {
  let app: Express;

  beforeEach(() => {
    // Fresh app and eventstore for each test
    const result = createApp();
    app = result.app;
  });

  describe("Validation", () => {
    it("should return 400 when amount is missing", async () => {
      const response = await request(app).post("/deposit/123").send({});

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is zero", async () => {
      const response = await request(app).post("/deposit/123").send({ amount: 0 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is negative", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: -100 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount exceeds 1000", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: 1001 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is not a number", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: "one hundred" });

      expect(response.status).toBe(400);
    });
  });

  describe("Successful deposits", () => {
    it("should return 200 for a valid deposit amount", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: 100 });

      expect(response.status).toBe(200);
    });

    it("should return 200 for minimum valid amount (just above 0)", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: 0.01 });

      expect(response.status).toBe(200);
    });

    it("should return 200 for maximum valid amount (exactly 1000)", async () => {
      const response = await request(app)
        .post("/deposit/123")
        .send({ amount: 1000 });

      expect(response.status).toBe(200);
    });

    it("should accept multiple consecutive deposits", async () => {
      const response1 = await request(app)
        .post("/deposit/123")
        .send({ amount: 100 });
      const response2 = await request(app)
        .post("/deposit/123")
        .send({ amount: 200 });
      const response3 = await request(app)
        .post("/deposit/123")
        .send({ amount: 300 });

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });
  });

  describe("Event storage", () => {
    it("should store deposit event in eventstore", async () => {
      const { app, store } = createApp();

      await request(app).post("/deposit/123").send({ amount: 500 });

      const events = await store.getEvents("123");
      expect(events).toHaveLength(1);
      expect(events[0]?.data.amount).toBe(500);
    });

    it("should store multiple deposit events", async () => {
      const { app, store } = createApp();

      await request(app).post("/deposit/123").send({ amount: 100 });
      await request(app).post("/deposit/123").send({ amount: 200 });

      const events = await store.getEvents("123");
      expect(events).toHaveLength(2);
      expect(events[0]?.data.amount).toBe(100);
      expect(events[1]?.data.amount).toBe(200);
    });
  });
});
