import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entity/user.entity';
import { Twilio } from 'twilio';
import { TWILIO_CLIENT } from './constants';

@Injectable()
export class SmsService {
  constructor(
    @Inject(TWILIO_CLIENT)
    private readonly twilioClient: Twilio,
  ) {}

  async sendSms(user: UserEntity, body: string) {
    try {
      await this.twilioClient.messages.create({
        body: 'sup',
        from: '1',
        to: '1',
      });
    } catch (error) {
      console.log(error.sid);
    }
  }
}
