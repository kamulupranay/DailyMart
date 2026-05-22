import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export interface CreatePaymentOrderRequest {
  amount: number;
  currency: string;
}

export interface CreatePaymentOrderResponse {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  message: string;
  paymentId: string;
  orderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private checkoutScriptPromise: Promise<void> | null = null;

  createOrder(amount: number): Observable<CreatePaymentOrderResponse> {
    return this.http.post<CreatePaymentOrderResponse>(
      `${this.apiUrl}/payments/create-order`,
      {
        amount,
        currency: environment.paymentCurrency,
      },
      { withCredentials: true }
    );
  }

  verifyPayment(response: RazorpayPaymentResponse): Observable<VerifyPaymentResponse> {
    return this.http.post<VerifyPaymentResponse>(
      `${this.apiUrl}/payments/verify`,
      response,
      { withCredentials: true }
    );
  }

  loadCheckoutScript(): Promise<void> {
    if (window.Razorpay) {
      return Promise.resolve();
    }

    if (this.checkoutScriptPromise) {
      return this.checkoutScriptPromise;
    }

    this.checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
      document.body.appendChild(script);
    });

    return this.checkoutScriptPromise;
  }

  openCheckout(
    order: CreatePaymentOrderResponse,
    onSuccess: (response: RazorpayPaymentResponse) => void,
    onClose: () => void
  ) {
    if (!window.Razorpay) {
      throw new Error('Razorpay checkout is not available.');
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Daily Mart',
      description: 'Order payment',
      order_id: order.orderId,
      notes: {
        receipt: order.receipt,
      },
      theme: {
        color: '#0f7a3a',
      },
      handler: onSuccess,
      modal: {
        ondismiss: onClose,
      },
    });

    checkout.open();
  }
}
