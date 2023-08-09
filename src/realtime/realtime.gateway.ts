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

interface IHit {
  doc: IInnerHit;
}

interface IInnerHit {
  appid: number;
  name: string;
}

@WebSocketGateway()
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly realtimeService: RealtimeService) {}

  handleConnection(client: Socket) {
    this.realtimeService.newConnection(client);
    this.realtimeService
      .search('grand theft')
      .then((res) => res.hits.hits.forEach((hit) => console.log(hit)));
    console.log('connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    this.realtimeService.closeConnection(client);
  }
}
