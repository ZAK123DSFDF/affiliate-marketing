const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Wrap in an async function since top-level await isn't allowed in CommonJS
(async () => {
  const deleted = await stripe.accounts.del("acct_1RLV26Ikl1Zk74oE");
  console.log("Deleted account:", deleted);
})();
