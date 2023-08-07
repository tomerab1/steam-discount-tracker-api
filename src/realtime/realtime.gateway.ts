import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { RealtimeService } from './realtime.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly realtimeService: RealtimeService) {}
  handleConnection(client: Socket, ...args: any[]) {
    console.log('connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('disocnnected:', client.id);
  }
}
