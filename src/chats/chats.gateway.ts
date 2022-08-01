import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './models/users.model';
import { Chatting } from './models/chattings.model';
import { InjectModel } from '@nestjs/mongoose';

@WebSocketGateway({
  namespace: 'chattings',
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
  ) {
    this.logger.log('constructor');
  }

  // 클래스가 초기화 된 이후 자동 실행
  afterInit(server: any): any {
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`[${socket.nsp.name}] ${socket.id} connect`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.userModel.findOne({ socketId: socket.id });

    if (user) {
      socket.broadcast.emit('disconnect_user', user.name);
      await user.delete();
    }
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.userModel.findOne({ socketId: socket.id });

    await this.chattingModel.create({
      user,
      chat: message,
    });

    socket.broadcast // username db save
      .emit('new_chat', {
        username: user.name,
        message,
      });
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    // username db save
    const exist = await this.userModel.exists({ name: username });

    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
    }

    await this.userModel.create({
      socketId: socket.id,
      name: username,
    });

    socket.broadcast.emit('connected_user', username);
    return username;
  }
}
