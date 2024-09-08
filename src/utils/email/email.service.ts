import { EmailPaths } from '../../constants/email-paths.enum';
import { WinstonLogger } from '../logger/winston.logger';
import { IEmailService } from './email.service.interface';
// import { SMTPClient, Message } from 'emailjs';
// import { configService } from '../config/config.service';
// import { CompanyDetails } from '../../constants/company-details.enum';

// /**
//  * @summary contains email related logic
//  */
// export class EmailService implements IEmailService {
//   private readonly client: SMTPClient;

//   /**
//    * @constructor
//    */
//   constructor() {
//     this.client = new SMTPClient({
//       user: configService.get<string>('MAIL_USER'),
//       password: configService.get<string>('MAIL_PASS'),
//       host: configService.get<string>('MAIL_HOST'),
//       ssl: true,
//     });
//   }

//   /**
//    * Sends Email Notification
//    * @param to
//    * @param subject
//    * @param message
//    */
//   sendMail(to: string, subject: string, message: string): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//       this.client.send(
//         new Message({
//           from: CompanyDetails.SUPPORT_EMAIL,
//           to,
//           subject,
//           text: message,
//         }),
//         (err) => {
//           if (err) {
//             console.log(err);
//             return reject(false);
//           }
//           resolve(true);
//         }
//       );
//     });
//   }
// }

export class EmailService implements IEmailService {
    private readonly logger: WinstonLogger;
    constructor(){
        this.logger = new WinstonLogger("EmailService");
    }


    sendMail({ to, subject, options }: { to: string; subject: string; options: { template: EmailPaths; data: { [key: string]: any; }; }; }): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // Send email logic
            this.logger.info(`Email sent to ${to} with subject ${subject} and template ${options.template}`, options.data);
            resolve(true);
        });
    }
}