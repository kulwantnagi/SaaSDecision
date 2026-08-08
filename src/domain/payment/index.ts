export type PaymentProvider = 'STRIPE' | 'RAZORPAY';

export interface CreateOrderInput {
  productType: 'EXPERT_AUDIT' | 'REPLACEMENT_BLUEPRINT';
  amount: number;
  currency: 'USD' | 'INR';
  userEmail: string;
  provider: PaymentProvider;
}

export interface OrderResult {
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  checkoutUrl?: string;
}

/**
 * Payment Provider Abstraction supporting Stripe and Razorpay
 */
export async function createPaymentOrder(input: CreateOrderInput): Promise<OrderResult> {
  const orderId = `ord_${input.provider.toLowerCase()}_` + Math.random().toString(36).substring(2, 10);

  if (input.provider === 'STRIPE') {
    return {
      orderId,
      provider: 'STRIPE',
      amount: input.amount,
      currency: input.currency,
      status: 'PENDING',
      checkoutUrl: `https://checkout.stripe.com/pay/${orderId}`,
    };
  }

  return {
    orderId,
    provider: 'RAZORPAY',
    amount: input.amount,
    currency: input.currency,
    status: 'PENDING',
    checkoutUrl: `https://api.razorpay.com/v1/checkout/${orderId}`,
  };
}
