import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // private socket;
  // employeeDistribution = this.socket.fromEvent<object[]>('employeeDistribution')
  // employeeCount = this.socket.fromEvent<object>('employeeCount')
  // constructor(private socket: Socket) { }
  // getEmployeeDistribution(){
  //   this.socket.emit('getEmployeeDistribution');
  // }
  // getActiveEmployeeCount(){
  //   this.socket.emit('getActiveEmployeeCount');
  // }
  // connect(): Subject<MessageEvent> {
  //   this.socket = io(environment.siteUri);
  //   let observable = new Observable(observer => {
  //     this.socket.on('message', (data) => {
  //       console.log('Recieved Message from server');
  //       observer.next(data);
  //     })
  //   return () => {
  //     this.socket.disconnect();
  //   }
  //   });
  //   let observer = {
  //     next: (data: Object) => {
  //       this.socket.emit('message', JSON.stringify(data));
  //     },
  //   };
  //   return Subject.create(observer, observable);
  // }
}
