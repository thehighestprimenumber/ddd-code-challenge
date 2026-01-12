import Express from "express";
import { eventstore } from "./eventstore/eventstore";

export const createApp = (store = eventstore()) => {
  const app = Express();
  app.use(Express.json());

  // TODO: Implement endpoints here using the provided store

  return { app, store };
};
