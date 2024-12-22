import { configService } from '../../utils/config/config.service';

export class QuickTellerRequest{
    protected readonly merchant_code: string;
    protected readonly pay_item_id: string;
    mode: string;
    site_redirect_url: string;
    txn_ref: string;
    amount: number;
    currency: number;


    constructor(reference: string, amount: number){
        this.merchant_code = configService.get<string>("QUICKTELLER_MERCHANT_CODE")!;
        this.pay_item_id = configService.get<string>("QUICKTELLER_PAY_ITEM_ID")!;
        this.mode = configService.get<string>("QUICKTELLER_MODE")!;
        this.site_redirect_url = `${configService.get<string>("QUICKTELLER_SITE_REDIRECT_URL")!}?txn_ref=${reference}`;
        this.txn_ref = reference;
        this.amount = amount;
        this.currency = 566;
    }
}