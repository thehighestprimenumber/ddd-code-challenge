import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "./app";
import type { Express } from "express";

describe("TODO 2: POST /withdrawal", () => {
  let app: Express;

  beforeEach(() => {
    const result = createApp();
    app = result.app;
  });

  describe("Validation", () => {
    it("should return 400 when amount is missing", async () => {
      const response = await request(app).post("/withdrawal").send({});

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is zero", async () => {
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 0 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is negative", async () => {
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: -100 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount exceeds 1000", async () => {
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 1001 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when amount is not a number", async () => {
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: "fifty" });

      expect(response.status).toBe(400);
    });
  });

  describe("Balance validation", () => {
    it("should return 400 when withdrawing from empty account", async () => {
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 100 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when withdrawal exceeds balance", async () => {
      // First deposit some money
      await request(app).post("/deposit").send({ amount: 100 });

      // Try to withdraw more than available
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 150 });

      expect(response.status).toBe(400);
    });

    it("should return 400 when second withdrawal would overdraw", async () => {
      await request(app).post("/deposit").send({ amount: 200 });
      await request(app).post("/withdrawal").send({ amount: 150 });

      // Only 50 left, trying to withdraw 100
      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 100 });

      expect(response.status).toBe(400);
    });
  });

  describe("Successful withdrawals", () => {
    it("should return 200 when balance is sufficient", async () => {
      await request(app).post("/deposit").send({ amount: 500 });

      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 200 });

      expect(response.status).toBe(200);
    });

    it("should return 200 when withdrawing exact balance", async () => {
      await request(app).post("/deposit").send({ amount: 300 });

      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 300 });

      expect(response.status).toBe(200);
    });

    it("should return 200 for maximum valid amount when balance allows", async () => {
      await request(app).post("/deposit").send({ amount: 1000 });

      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 1000 });

      expect(response.status).toBe(200);
    });

    it("should handle multiple withdrawals correctly", async () => {
      await request(app).post("/deposit").send({ amount: 500 });

      const response1 = await request(app)
        .post("/withdrawal")
        .send({ amount: 100 });
      const response2 = await request(app)
        .post("/withdrawal")
        .send({ amount: 100 });
      const response3 = await request(app)
        .post("/withdrawal")
        .send({ amount: 100 });

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });
  });

  describe("Event storage", () => {
    it("should store withdrawal event in eventstore", async () => {
      const { app, store } = createApp();

      await request(app).post("/deposit").send({ amount: 500 });
      await request(app).post("/withdrawal").send({ amount: 200 });

      const events = store.getEvents();
      expect(events).toHaveLength(2);
      expect(events[1]?.data.amount).toBe(200);
    });

    it("should not store event when withdrawal fails validation", async () => {
      const { app, store } = createApp();

      await request(app).post("/withdrawal").send({ amount: -100 });

      const events = store.getEvents();
      expect(events).toHaveLength(0);
    });

    it("should not store event when balance is insufficient", async () => {
      const { app, store } = createApp();

      await request(app).post("/deposit").send({ amount: 100 });
      await request(app).post("/withdrawal").send({ amount: 500 });

      const events = store.getEvents();
      // Only the deposit event should be stored
      expect(events).toHaveLength(1);
    });
  });

  describe("Integration: Deposit and Withdrawal flow", () => {
    it("should correctly track balance across multiple operations", async () => {
      const { app } = createApp();

      // Deposit 1000
      await request(app).post("/deposit").send({ amount: 1000 });

      // Withdraw 400 (balance: 600)
      const w1 = await request(app).post("/withdrawal").send({ amount: 400 });
      expect(w1.status).toBe(200);

      // Deposit 200 (balance: 800)
      await request(app).post("/deposit").send({ amount: 200 });

      // Withdraw 800 (balance: 0)
      const w2 = await request(app).post("/withdrawal").send({ amount: 800 });
      expect(w2.status).toBe(200);

      // Try to withdraw 1 more (should fail, balance is 0)
      const w3 = await request(app).post("/withdrawal").send({ amount: 1 });
      expect(w3.status).toBe(400);
    });

    it("should handle decimal amounts correctly", async () => {
      const { app } = createApp();

      await request(app).post("/deposit").send({ amount: 100.5 });

      const response = await request(app)
        .post("/withdrawal")
        .send({ amount: 100.5 });

      expect(response.status).toBe(200);
    });
  });
});
