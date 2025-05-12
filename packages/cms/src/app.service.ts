import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    // console.log('Environment Variables:', process.env);
    console.log('Loaded .env file:', this.configService.get<string>('ENV_FILE_PATH'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}