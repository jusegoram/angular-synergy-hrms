import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Employee } from "../../employee/Employee";
import { EmployeeService } from "../../employee/employee.service";
import { HrTracker } from "../../shared/models/hr-tracker";
import moment from "moment";
import { fromEvent } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import Swal from 'sweetalert2';
import { TRACKER_STATUS } from "../../../environments/environment";

@Component({
  selector: "app-trackers",
  templateUrl: "./trackers.component.html",
  styleUrls: ["./trackers.component.scss"],
})
export class TrackersComponent implements OnInit, AfterViewInit {
  @ViewChild('trackerInboxTable', {static: false}) trackerInboxTable: any;
  @ViewChild('inputFilter', {static: false}) inputFilter: any;  
  data:Array<HrTracker> = []; 
  filter='';
  isLoading=true;

  constructor(private employeeService:EmployeeService) {}  

  ngOnInit() {
    this.fetchTrackers();
  }

  ngAfterViewInit(){
    this.setUpInputFilter();
  }

  setUpInputFilter(){
    fromEvent(this.inputFilter.nativeElement, 'keydown')    
    .pipe(
      debounceTime(300),
      map( (event: any)=> event.target.value )
    ).subscribe((value)=>{
      this.filter= value.trim();
    });
  }

  get filteredData():Array<HrTracker>{
    if(this.filter && this.data){
      const filterNormalized= this.filter.toLowerCase();
      return this.data.filter((item:HrTracker)=>{        
        return item.employeeId.includes(filterNormalized) ||
               item.employee?.fullName.toLowerCase().includes(filterNormalized) ||
               item.creationFingerprint.name?.toLowerCase().includes(filterNormalized);
      });
    }
    return this.data;
  }
  
  async fetchTrackers(){
    try{
      const response=await this.employeeService.getTrackers();
      this.data=  response;      
      console.log('TrackersComponent',response);
    }catch(error){
      console.log('TrackersComponent',error);
    }finally{
      this.isLoading=false;
    }
  }

  toggleExpandRow(row){
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  saveAcceptedTrackerStatus(hrTracker:HrTracker){
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to accept this track?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then(async (result) => {
      if (result.value) {
        hrTracker.state= TRACKER_STATUS.IN_PROGRESS;
        let { _id } = hrTracker;
        try{
          await this.employeeService.updateTracker({      
            _id,    
            state: TRACKER_STATUS.IN_PROGRESS
          });
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
