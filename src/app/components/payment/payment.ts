import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Cart } from '../../services/cart';
import { PaymentService, RazorpayPaymentResponse } from '../../services/payment.service';
import { OrderService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

type PaymentMethod = 'card' | 'credit-card' | 'upi' | 'net-banking' | 'wallet' | 'cash';

interface PaymentOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Payment {
  private cartService = inject(Cart);
  private paymentService = inject(PaymentService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cartItems = this.cartService.getCart();
  subtotal = this.cartService.subtotal;
  deliveryFee = this.cartService.deliveryFee;
  tax = this.cartService.tax;
  total = this.cartService.total;
  selectedMethod = signal<PaymentMethod>('card');
  isProcessing = signal(false);
  paymentMessage = signal<string | null>(null);
  paymentError = signal<string | null>(null);
  displayCurrency = environment.paymentCurrency;

  paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      title: 'Debit card',
      subtitle: 'Visa, Mastercard, RuPay',
      icon: 'credit_card',
    },
    {
      id: 'credit-card',
      title: 'Credit card',
      subtitle: 'Pay now or convert to EMI',
      icon: 'payment',
    },
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Google Pay, PhonePe, Paytm',
      icon: 'qr_code_2',
    },
    {
      id: 'net-banking',
      title: 'Net banking',
      subtitle: 'All major banks',
      icon: 'account_balance',
    },
    {
      id: 'wallet',
      title: 'Wallet',
      subtitle: 'Amazon Pay, Paytm, Mobikwik',
      icon: 'account_balance_wallet',
    },
    {
      id: 'cash',
      title: 'Cash on delivery',
      subtitle: 'Pay when your order arrives',
      icon: 'local_shipping',
    },
  ];

  selectMethod(method: PaymentMethod) {
    this.selectedMethod.set(method);
  }

  payNow() {
    if (this.total() <= 0 || this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);
    this.paymentMessage.set(null);
    this.paymentError.set(null);

    this.paymentService.createOrder(this.total()).subscribe({
      next: async (order) => {
        try {
          await this.paymentService.loadCheckoutScript();
          this.paymentService.openCheckout(
            order,
            (response) => this.verifyPayment(response),
            () => {
              this.isProcessing.set(false);
              this.paymentError.set('Payment was cancelled.');
            }
          );
        } catch (error) {
          this.isProcessing.set(false);
          this.paymentError.set(error instanceof Error ? error.message : 'Payment checkout failed.');
        }
      },
      error: (error) => {
        this.isProcessing.set(false);
        this.paymentError.set(error.error?.message || error.message || 'Unable to create payment order.');
      },
    });
  }

  private verifyPayment(response: RazorpayPaymentResponse) {
    this.paymentService.verifyPayment(response).subscribe({
      next: (result) => {
        const paidItems = this.cartItems();
        const totalAmount = this.total();

        this.orderService.createOrder({
          items: paidItems.map((item) => ({
            productId: String(item.id),
            name: item.title,
            imageUrl: Array.isArray(item.image) ? item.image[0] || '' : item.image,
            quantity: item.qty,
            price: item.price,
          })),
          totalAmount,
          status: 'paid',
          payment: {
            provider: 'razorpay',
            paymentId: result.paymentId,
            orderId: result.orderId,
          },
        }).subscribe({
          next: () => {
            this.cartService.clear();
            this.isProcessing.set(false);
            this.paymentMessage.set(`Payment successful. Payment ID: ${result.paymentId}`);
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            this.isProcessing.set(false);
            this.paymentError.set(error.error?.message || error.message || 'Payment succeeded, but order could not be saved.');
          },
        });
      },
      error: (error) => {
        this.isProcessing.set(false);
        this.paymentError.set(error.error?.message || error.message || 'Payment verification failed.');
      },
    });
  }
}
