// Implement your endpoints here - see README.md for instructions
import Express from "express";
import { eventstore } from "./eventstore/eventstore";

export const createApp = (store = eventstore()) => {
  const app = Express();
  app.use(Express.json());

  // Your implementation goes here

  return { app, store };
};
