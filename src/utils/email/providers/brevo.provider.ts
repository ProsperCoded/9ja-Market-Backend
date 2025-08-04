import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import * as ejs from "ejs";
import path from "path";
import { IEmailService } from "../email.service.interface";
import { ILogger } from "../../logger/logger.interface";
import { configService } from "../../config/config.service";
import { EmailPaths, EmailSubjects } from "../../../constants/email.enum";

export default class BrevoProvider implements IEmailService {
  private readonly transactionalEmailsApi: TransactionalEmailsApi;
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.transactionalEmailsApi = new TransactionalEmailsApi();

    // Set API key for authentication
    const apiKey = configService.get<string>("BREVO_API_KEY");
    if (!apiKey) {
      throw new Error(
        "BREVO_API_KEY is required but not found in configuration"
      );
    }

    (this.transactionalEmailsApi as any).authentications.apiKey.apiKey = apiKey;
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
          // Create the email message object
          const sendSmtpEmail = new SendSmtpEmail();
          sendSmtpEmail.to = [
            {
              email: to,
              name: options.data.name || to.split("@")[0],
            },
          ];
          sendSmtpEmail.sender = {
            name: configService.get<string>("COMPANY_NAME") || "9ja Market",
            email: configService.get<string>("COMPANY_EMAIL"),
          };
          sendSmtpEmail.subject = subject;
          sendSmtpEmail.htmlContent = html;

          // Optional: Add text content as fallback
          sendSmtpEmail.textContent = this.stripHtml(html);

          // Send the email
          const result =
            await this.transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

          this.logger.info(
            `Email sent successfully via Brevo. Message ID: ${result.body?.messageId || "Unknown"}`
          );
          resolve(true);
        } catch (err: any) {
          this.logger.error("Error sending email via Brevo", err);

          // Log detailed error information if available
          if (err.response && err.response.body) {
            this.logger.error("Brevo API error details:", err.response.body);
          }

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
