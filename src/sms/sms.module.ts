import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { TWILIO_CLIENT } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    SmsService,
    {
      provide: TWILIO_CLIENT,
      useFactory: async (configService: ConfigService) => {
        return new Twilio(
          configService.get<string>('TWILIO_ACCOUNT_SID'),
          configService.get<string>('TWILIO_AUTH_TOKEN'),
        );
      },
      inject: [ConfigService],
    },
  ],
})
export class SmsModule {}
