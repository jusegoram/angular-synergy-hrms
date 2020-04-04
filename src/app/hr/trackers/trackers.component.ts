import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Employee } from "../../employee/Employee";
import { EmployeeService } from "../../employee/employee.service";
import { HrTracker } from "../../shared/models/hr-tracker";
import moment from "moment";
import { fromEvent } from "rxjs";
import { debounceTime, map } from "rxjs/operators";

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
        return item.employee?.toLowerCase().includes(filterNormalized) ||
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
    //this.employeeService.getTrackers
  }

  

}
