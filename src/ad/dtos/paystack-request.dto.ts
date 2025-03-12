import { configService } from "../../utils/config/config.service";

export class PaystackRequest {
  public_key: string;
  reference: string;
  amount: number;
  currency: string;
  callback_url: string;
  email: string;

  constructor(id: string, amount: number, email: string) {
    this.public_key = configService.get<string>("PAYSTACK_PUBLIC_KEY")!;
    this.reference = `txn-${id}`;
    this.amount = amount * 100; // Convert to kobo
    this.currency = "NGN";
    this.callback_url = `${configService.get<string>("PAYSTACK_CALLBACK_URL")!}?reference=${this.reference}`;
    this.email = email;
  }
}
