import { Injectable, Logger } from '@nestjs/common';
import twilio from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  private client: any;
  private logger = new Logger(TwilioService.name);

  constructor(private config: ConfigService) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.client = (twilio as any)(accountSid || '', authToken || '');
  }

  async sendVerificationCode(phone: string) {
    // Using Twilio Verify service is recommended; fallback to SMS
    const serviceSid = this.config.get<string>('TWILIO_VERIFY_SERVICE_SID');
    if (serviceSid) {
      const res = await this.client.verify
        .services(serviceSid)
        .verifications.create({ to: phone, channel: 'sms' });
      return res;
    }

    // Fallback: send simple SMS (not a real verification flow)
    const from = this.config.get<string>('TWILIO_PHONE_FROM');
    const body = `Your verification code is ${Math.floor(100000 + Math.random() * 900000)}`;
    const msg = await this.client.messages.create({ to: phone, from: from || undefined, body });
    this.logger.debug(`Sent twilio message ${msg.sid} to ${phone}`);
    return msg;
  }

  async verifyCode(phone: string, code: string) {
    const serviceSid = this.config.get<string>('TWILIO_VERIFY_SERVICE_SID');
    if (!serviceSid) return false;
    const res = await this.client.verify
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });
    return res.status === 'approved';
  }
}
