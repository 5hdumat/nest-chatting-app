import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { User, UserSchema } from './models/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
