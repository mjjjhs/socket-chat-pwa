import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
import { AppController } from './app/app.controller';


@Module({
  imports: [],
  controllers: [AlertController, AppController],
  providers: [ChatGateway, AlertGateway],
})
export class AppModule {}
