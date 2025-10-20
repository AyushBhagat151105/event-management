import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return {
      message: 'Helth check successful. \nThe Event Management API is running.',
    };
  }
}
