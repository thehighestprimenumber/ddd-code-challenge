import Express from "express";

const app = Express();

/*
Read the exercise carefully FIRST, and then implement the code accordingly.

This is a super simplified bank account system that supports deposits and withdrawals.

The eventstore in the src/eventstore/eventstore.ts file is an in-memory event store used
to store the events of the bank account and it mimics the behavior of a real event store.
It is not meant to be modified or extended in any way.
The eventstore Types are in the src/eventstore/types.ts file. This file could be modified
or extended if needed.

TODO 1: Implement the API endpoint for the bank account Deposit which should:
(AI Usage discouraged for this task)

- receive a payload with the amount of the deposit
- Validate that the amount is a positive number less than 1000 or reject the request with a 400 status code
- return a 200 status code if the deposit is successful

TODO 2: Implement the API endpoint for the bank account Withdrawal which should:
(AI Usage discouraged for this task)

- receive a payload with the amount of the withdrawal
- Validate that the amount is a positive number less than 1000 or reject the request with a 400 status code
- Validate that there is enough balance in the account or reject the request with a 400 status code
- return a 200 status code if the withdrawal is successful

TODO 3: Modify the current implementation to support multiple bank accounts
(AI Usage required for this task)

*/


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});