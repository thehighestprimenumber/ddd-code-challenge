// Implement your endpoints here - see README.md for instructions
import Express from "express";
import { eventstore } from "./eventstore/eventstore";
import { EventType } from "./eventstore/types";

export const createApp = (store = eventstore()) => {
  const app = Express();
  app.use(Express.json());
  let balances = new Map<string, number>();


  const reduceState = (events: EventType[]) => {
    let state: { status?: 'active' | 'inactive', balance?: number } | null = {};
    for (const event of events) {
      switch (event.name) {
        case "Deposited":
          state = {
            ...state,
            balance: (state?.balance || 0) + event.data.amount
          }
          break;
        case "Withdrawn":
          state = {
            ...state,
            balance: (state?.balance || 0) - event.data.amount
          }
          break;
      }
    }
    return state;
  }

  store.onEvent("Deposited", (event) => {
    console.log("Deposited", event);
    balances.set(
      event.accountId,
      (balances.get(event.accountId) || 0) + event.data.amount
    );
    console.log("Balances", balances);
  });
  store.onEvent("Withdrawn", (event) => {
    console.log("Withdrawn", event);
    balances.set(
      event.accountId,
      (balances.get(event.accountId) || 0) - event.data.amount
    );
  });
  app.post("/deposit/:accountId", (req, res) => {
    try {
      const { accountId } = req.params;
      const { amount } = req.body;
      try {
        validateAmount(amount);
      } catch (e) {
        return res.status(400).json(e.message);
      }
      store.commitEvent({
        name: "Deposited",
        data: { amount, accountId },
        accountId,
        timestamp: new Date(),
      });
      res.status(200).json({ message: "Deposit successful" });
    } catch (error) {
      console.error("Error in deposit handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/withdrawal/:accountId", async (req, res) => {
    try {
      const { amount } = req.body;
      const { accountId } = req.params;

      try {
        validateAmount(amount);
      } catch (e) {
        return res.status(400).json(e.message);
      }
      // const balance = balances.get(accountId) || 0;
      const events = await store.getEvents(accountId);
      const state = reduceState(events);
      const balance = state?.balance || 0;
      if (balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }

      store.commitEvent({
        name: "Withdrawn",
        data: { amount, accountId },
        accountId,
        timestamp: new Date(),
      });
      res.status(200).json({ message: "Withdrawal successful" });
    } catch (error) {
      console.error("Error in deposit handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/balance/:accountId", (req, res) => {
    const { accountId } = req.params;
    try {
      const balance = balances.get(accountId) || 0;
      res.status(200).json({ balance });
    } catch (e) {
      console.error("Error in balance handler:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return { app, store };
};
function validateAmount(amount: any) {
  if (typeof amount !== 'number') {
    throw new Error("Amount must be a number");
  }
  if (!amount) {
    throw new Error("Amount is required");
  }
  if (amount <= 0 || amount > 1000) {
    throw new Error("Amount must be between 0 and 1000");
  }
}

