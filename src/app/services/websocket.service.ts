import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import * as Rx from 'rxjs';


@Injectable()
export class WebSocketService {
  private url = 'http://localhost:3000';
  private socket = io(this.url); // connecting to the server
  constructor() {}
  // connect(conversationId): Subject<MessageEvent> {
  //   this.socket = io(this.url);
  //   const observable = new Observable(ob => {
  //     this.socket.on('join', (data) => {
  //       console.log('Message received');
  //       ob.next(data);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //   const observer = {
  //     next: (data: Object) => {
  //       this.socket.emit('join', {token: conversationId });
  //     }
  //   };
  //   return Subject.create(observer, observable);
  // }
  joinRoom(conversationId) {
    this.socket.emit('join', {
      token: conversationId
    });
  }
  new_joined() {
    const observable = new Observable<{ room: String, message: String }>( obs => {
      this.socket.on('room_joined', (data) => {
        obs.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  sendMessage(data) {
    this.socket.emit('message', data);
  }
  onMessageBox(data) {
    this.socket.emit('onMessage', data);
  }
  new_message() {
    const observable = new Observable<any>( obs => {
      this.socket.on('new_message', (data) => {
        obs.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  typing(conversationId) {
    this.socket.emit('typing', {
      token: conversationId
    });
  }
  blur(conversationId) {
    this.socket.emit('blur', {
      token: conversationId
    });
  }
  new_typing() {
    const observable = new Observable<any>( obs => {
      this.socket.on('new_typing', (data) => {
        obs.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  new_blur() {
    const observable = new Observable<any>( obs => {
      this.socket.on('new_blur', (data) => {
        obs.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

}
