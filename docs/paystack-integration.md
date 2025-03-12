# Paystack Payment Integration Guide for React

## Overview

This guide explains how to integrate Paystack payments into your React frontend application for the 9ja Market API.

## Prerequisites

- Paystack public key (obtained from your .env file)
- React application
- TypeScript (optional but recommended)

## Integration Steps

### 1. Install Paystack React Library

```bash
npm install @paystack/inline-js
# or
yarn add @paystack/inline-js
```

### 2. Create Payment Component

```tsx
import { PaystackProps, usePaystackPayment } from "@paystack/inline-js";
import { useState } from "react";

interface PaymentResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
}

export const AdPaymentButton = ({
  level,
  productId,
}: {
  level: number;
  productId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      // 1. Call backend to initialize payment
      const response = await fetch(
        `/api/ads/payment/initialize/${level}/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentData: PaymentResponse = await response.json();

      // 2. Configure Paystack
      const config: PaystackProps = {
        email: userEmail, // Get from your auth context/state
        amount: paymentData.amount, // Amount in kobo
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY!,
        reference: paymentData.reference,
        onSuccess: (response) => {
          verifyPayment(response.reference);
        },
        onClose: () => {
          console.log("Payment canceled");
        },
      };

      const initializePayment = usePaystackPayment(config);
      initializePayment();
    } catch (error) {
      console.error("Payment initialization failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/ads/payment/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();

      if (data.status === "success") {
        // Handle successful payment (e.g., show success message, redirect)
        console.log("Payment successful");
      } else {
        // Handle failed payment
        console.log("Payment failed");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
    }
  };

  return (
    <button onClick={initializePayment} disabled={isLoading}>
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
};
```

### 3. Usage in Your React Component

```tsx
import { AdPaymentButton } from "./AdPaymentButton";

const ProductPage = () => {
  return (
    <div>
      <h1>Product Details</h1>
      {/* Other product details */}
      <AdPaymentButton level={1} productId="product-uuid" />
    </div>
  );
};
```

## Environment Setup

Create a `.env` file in your React project root:

```env
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## Payment Flow

1. User clicks payment button
2. Frontend calls backend to initialize payment and get transaction details
3. Paystack popup opens with payment options
4. User completes payment
5. Success callback triggers payment verification
6. Backend verifies and updates payment status
7. UI updates to reflect payment status

## Error Handling

- Handle network errors during API calls
- Handle payment modal close events
- Verify payment status on backend before confirming success
- Implement loading states for better UX

## Security Considerations

- Keep Paystack public key in environment variables
- Always verify payments on the backend
- Use HTTPS for all API calls
- Implement proper authorization
