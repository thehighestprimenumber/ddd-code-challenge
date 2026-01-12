/*
Read the exercise carefully FIRST, and then implement the code accordingly.

This is a super simplified bank account system that supports deposits and withdrawals.

The eventstore in the src/eventstore/eventstore.ts file is an in-memory event store used
to store the events of the bank account and it mimics the behavior of a real event store.
It is not meant to be modified or extended in any way.
The eventstore Types are in the src/eventstore/types.ts file. This file could be modified
or extended if needed.

Implementation notes:
- Use src/app.ts to implement your endpoints (the createApp function)
- The app is already configured with Express.json() middleware
- An eventstore instance is provided to createApp - use it for storing/retrieving events
- Run tests with: yarn test

TODO 1: Implement the API endpoint for the bank account Deposit which should:
(AI Usage discouraged for this task)

- POST /deposit
- Receive a JSON payload with the amount of the deposit
- Validate that the amount is a positive number (greater than 0 and at most 1000)
  or reject the request with a 400 status code
- Return a 200 status code if the deposit is successful

TODO 2: Implement the API endpoint for the bank account Withdrawal which should:
(AI Usage discouraged for this task)

- POST /withdrawal
- Receive a JSON payload with the amount of the withdrawal
- Validate that the amount is a positive number (greater than 0 and at most 1000)
  or reject the request with a 400 status code
- Validate that there is enough balance in the account or reject the request with a 400 status code
- Return a 200 status code if the withdrawal is successful

TODO 3: Modify the current implementation to support multiple bank accounts
(AI Usage required for this task)

- Each account should be identified by an accountId
- Deposits and withdrawals should be scoped to a specific account
- Balance validation should only consider events for the specific account

TODO 4: (CQRS) Implement a read model for fast balance queries
(AI Usage required for this task)

- Leverage the eventstore's event emitter (onEvent) to maintain an in-memory balance projection
- Create a GET /balance endpoint that returns the current balance instantly without reducing events
- The read model should stay in sync as new events are committed

TODO 5: Avoid race conditions when depositing or withdrawing from the account
(Discussion topic - no implementation required)

- What happens if two concurrent withdrawals both pass the balance check?
- How would you implement concurrency control?
- How would you ensure idempotency of operations?

*/

import { createApp } from "./app";

const { app } = createApp();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});