import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Employee } from "../../employee/Employee";
import { EmployeeService } from "../../employee/employee.service";
import { HrTracker } from "../../shared/models/hr-tracker";
import moment from "moment";
import { fromEvent } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import Swal from 'sweetalert2';
import { TRACKER_STATUS } from "../../../environments/environment";
import { SessionService } from "../../session/session.service";

@Component({
  selector: "app-trackers",
  templateUrl: "./trackers.component.html",
  styleUrls: ["./trackers.component.scss"],
})
export class TrackersComponent implements OnInit, AfterViewInit {
  @ViewChild('trackerInboxTable', {static: false}) trackerInboxTable: any;
  @ViewChild('inputFilter', {static: false}) inputFilter: any;  
  pendingTrackersInbox:Array<HrTracker> = []; 
  inProgressTrackersInbox:Array<HrTracker> = [];   
  isLoading=true;  
  constructor(private employeeService:EmployeeService, private sessionService: SessionService) {}  

  ngOnInit() {    
    this.fetchTrackers();
  }

  ngAfterViewInit(){
    
  }
  
  async fetchTrackers(){
    try{
      this.pendingTrackersInbox=await this.employeeService.getTrackers({
        state: TRACKER_STATUS.PENDING
      });
      this.inProgressTrackersInbox=await this.employeeService.getTrackers({
        state: TRACKER_STATUS.IN_PROGRESS+'.'+TRACKER_STATUS.DONE,
        creationFingerprintUserId: this.sessionService.getId()
      });
      console.log('TrackersComponent - pending',this.pendingTrackersInbox);
      console.log('TrackersComponent - in progress',this.inProgressTrackersInbox);
    }catch(error){
      console.log('TrackersComponent',error);
    }finally{
      this.isLoading=false;
    }
  }

  toggleExpandRow(row){
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  saveNewTrackerStatus(hrTracker:Partial<HrTracker>){
    let status='accept';
    if(hrTracker.state==TRACKER_STATUS.DONE){
      status='finish';
    }
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to '+status+' this track?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then(async (result) => {
      if (result.value) {        
        try{
          await this.employeeService.updateTracker(hrTracker);
          location.reload();
        }catch(error){
          Swal.fire(
            'Done!',
            'Error happened. Try again later.',
            'error'
          );
        }        
        /*Swal.fire(
          'Done!',
          'The tracker has been updated state to ACCEPTED.',
          'success'
        )*/        
      } 
    })
  }

  

}
