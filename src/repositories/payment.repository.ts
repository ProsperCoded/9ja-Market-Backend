import axios from "axios";
import { configService } from "../utils/config/config.service";

export class PaystackPaymentRepository {
  private readonly BASE_URL = "https://api.paystack.co";
  private readonly SECRET_KEY: string;

  constructor() {
    this.SECRET_KEY = configService.get<string>("PAYSTACK_SECRET_KEY")!;
  }

  async initializePayment(email: string, amount: number, reference: string) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo
          reference,
          callback_url: `${configService.get<string>("PAYSTACK_CALLBACK_URL")!}?reference=${reference}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Payment initialized:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error initializing payment:", error);
      return false;
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  }
}
