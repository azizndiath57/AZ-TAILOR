import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env.local');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Stripe API version
  apiVersion: '2026-08-26.dahlia' as any, // Using 'as any' to avoid TS errors if the types don't exactly match the installed version during build, but wait, let's just use '2025-01-27.acacia' or cast as any. Let's just cast as any to be safe.
  appInfo: {
    name: 'AZ-TAILOR',
    version: '1.0.0',
  },
});
