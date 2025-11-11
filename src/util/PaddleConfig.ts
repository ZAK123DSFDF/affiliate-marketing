const isProd = process.env.NODE_ENV === "production"

export const paddleConfig = {
  token: isProd
    ? process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_PRODUCTION!
    : process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX!,
  priceIds: {
    SUBSCRIPTION: {
      MONTHLY: {
        PRO: isProd
          ? process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_PRO_MONTHLY_PRODUCTION!
          : process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_PRO_MONTHLY_SANDBOX!,
        ULTIMATE: isProd
          ? process.env
              .NEXT_PUBLIC_PADDLE_PRICE_SUB_ULTIMATE_MONTHLY_PRODUCTION!
          : process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_ULTIMATE_MONTHLY_SANDBOX!,
      },
      YEARLY: {
        PRO: isProd
          ? process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_PRO_YEARLY_PRODUCTION!
          : process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_PRO_YEARLY_SANDBOX!,
        ULTIMATE: isProd
          ? process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_ULTIMATE_YEARLY_PRODUCTION!
          : process.env.NEXT_PUBLIC_PADDLE_PRICE_SUB_ULTIMATE_YEARLY_SANDBOX!,
      },
    },
    PURCHASE: {
      PRO: isProd
        ? process.env.NEXT_PUBLIC_PADDLE_PRICE_BUY_PRO_PRODUCTION!
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_BUY_PRO_SANDBOX!,
      ULTIMATE: isProd
        ? process.env.NEXT_PUBLIC_PADDLE_PRICE_BUY_ULTIMATE_PRODUCTION!
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_BUY_ULTIMATE_SANDBOX!,
    },
  },
}
