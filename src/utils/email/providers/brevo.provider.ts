import * as ejs from "ejs";
import path from "path";
import { IEmailService } from "../email.service.interface";
import { ILogger } from "../../logger/logger.interface";
import { configService } from "../../config/config.service";
import { EmailPaths, EmailSubjects } from "../../../constants/email.enum";

export default class BrevoProvider implements IEmailService {
  private readonly apiKey: string;
  private readonly apiUrl: string = "https://api.brevo.com/v3/smtp/email";
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;

    // Get API key for authentication
    const apiKey = configService.get<string>("BREVO_API_KEY");
    if (!apiKey) {
      throw new Error(
        "BREVO_API_KEY is required but not found in configuration"
      );
    }

    this.apiKey = apiKey;
  }

  public sendMail({
    to,
    subject,
    options,
  }: {
    to: string;
    subject: EmailSubjects;
    options: { template: EmailPaths; data: { [key: string]: any } };
  }): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const template = path.resolve("view/emails", options.template);

      ejs.renderFile(template, options.data, async (error, html) => {
        if (error) {
          this.logger.error("Error rendering email template", error);
          reject(error);
          return;
        }

        try {
          // Prepare email data for Brevo API
          const emailData = {
            sender: {
              name: configService.get<string>("COMPANY_NAME") || "9ja Market",
              email: configService.get<string>("COMPANY_EMAIL"),
            },
            to: [
              {
                email: to,
                name: options.data.name || to.split("@")[0],
              },
            ],
            subject: subject,
            htmlContent: html,
            textContent: this.stripHtml(html), // Add text fallback
          };

          // Send email via Brevo API
          const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": this.apiKey,
            },
            body: JSON.stringify(emailData),
          });

          if (!response.ok) {
            const errorData = await response.text();
            this.logger.error("Brevo API error:", errorData);
            throw new Error(
              `Brevo API error: ${response.status} - ${errorData}`
            );
          }

          const result = await response.json();
          this.logger.info(
            `Email sent successfully via Brevo API. Message ID: ${result.messageId || "Unknown"}`
          );
          resolve(true);
        } catch (err: any) {
          this.logger.error("Error sending email via Brevo API", err);
          reject(err);
        }
      });
    });
  }

  /**
   * Simple helper to strip HTML tags for text content
   * This provides a fallback text version of the email
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces/newlines with single space
      .trim(); // Remove leading/trailing whitespace
  }
}
