const stripe = require("stripe")(
  "sk_test_51REW2mRE6SeqN11Bh6ATQ86XnnfFr07MG7mqlwr8zq4kPzYiIwKbo1dq0bC2167b9CjzXSxEVyKRLkp5HbJfSRhM00S1rcEedc",
);

// Wrap in an async function since top-level await isn't allowed in CommonJS
(async () => {
  const deleted = await stripe.accounts.del("acct_1RLV26Ikl1Zk74oE");
  console.log("Deleted account:", deleted);
})();
