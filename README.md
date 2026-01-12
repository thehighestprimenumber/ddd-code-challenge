# Bank Account Event Sourcing Challenge

A simplified bank account system using event sourcing. Your task is to implement deposits, withdrawals, and related features.

## Getting Started

```bash
yarn install
yarn start       # Start the server on port 3000
yarn test        # Run tests
yarn test:watch  # Run tests in watch mode
```

## Project Structure

```
src/
├── app.ts                 # Implement your endpoints here
├── index.ts               # Server entry point (no changes needed)
├── eventstore/
│   ├── eventstore.ts      # In-memory event store (do not modify)
│   └── types.ts           # Event types (can be extended)
└── bankAccount/
    └── bankAccount.types.ts  # Domain types (can be extended)
```

## The Event Store

The event store (`src/eventstore/eventstore.ts`) is an in-memory implementation that mimics a real event store. **Do not modify this file.**

```typescript
const store = eventstore();

// Append an event
store.commitEvent({ name: "Deposited", data: { amount: 100 }, timestamp: new Date() });

// Read all events
const events = store.getEvents();

// Subscribe to events (for read models)
store.onEvent("Deposited", (event) => console.log("New deposit:", event));
```

---

## TODO 1: Implement Deposit Endpoint
**AI Usage: Discouraged**

Create `POST /deposit` that:

- Receives JSON payload: `{ "amount": number }`
- Validates amount is greater than 0 and at most 1000
- Returns `400` if validation fails
- Returns `200` if deposit is successful
- Commits a deposit event to the event store

---

## TODO 2: Implement Withdrawal Endpoint
**AI Usage: Discouraged**

Create `POST /withdrawal` that:

- Receives JSON payload: `{ "amount": number }`
- Validates amount is greater than 0 and at most 1000
- Validates sufficient balance exists (reduce events to calculate current balance)
- Returns `400` if validation fails or insufficient funds
- Returns `200` if withdrawal is successful
- Commits a withdrawal event to the event store

---

## TODO 3: Support Multiple Bank Accounts
**AI Usage: Required**

Modify the implementation to support multiple accounts:

- Each account identified by `accountId`
- Deposits and withdrawals scoped to a specific account
- Balance validation only considers events for that account

---

## TODO 4: Implement Read Model (CQRS)
**AI Usage: Required**

Create a read model for fast balance queries:

- Use the event store's `onEvent()` to maintain an in-memory balance projection
- Create `GET /balance` that returns the current balance instantly
- The read model must stay in sync as new events are committed

---

## TODO 5: Discussion - Race Conditions
**No implementation required**

Be prepared to discuss:

- What happens if two concurrent withdrawals both pass the balance check?
- How would you implement concurrency control?
- How would you ensure idempotency of operations?

---

## Implementation Notes

- Use `src/app.ts` to implement your endpoints
- The `createApp()` function receives an event store instance
- Express JSON middleware is already configured
- Run `yarn test` to validate your implementation
