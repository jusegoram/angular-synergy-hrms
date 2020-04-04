import { Component, OnInit } from "@angular/core";
import { Employee } from "../../employee/Employee";
import { EmployeeService } from "../../employee/employee.service";
import { HrTracker } from "../../shared/models/hr-tracker";
import moment from "moment";

@Component({
  selector: "app-trackers",
  templateUrl: "./trackers.component.html",
  styleUrls: ["./trackers.component.scss"],
})
export class TrackersComponent implements OnInit {
  data:Array<HrTracker> = []; 
  isLoading=true;
  constructor(private employeeService:EmployeeService) {}

  ngOnInit() {
    this.fetchTrackers();
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

  saveAcceptedTrackerStatus(hrTracker:HrTracker){
    //this.employeeService.getTrackers
  }

  

}
