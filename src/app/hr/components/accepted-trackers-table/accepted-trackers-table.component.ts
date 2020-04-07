import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HrTracker } from '../../../shared/models/hr-tracker';
import { TRACKER_STATUS } from '../../../../environments/environment';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-accepted-trackers-table',
  templateUrl: './accepted-trackers-table.component.html',
  styleUrls: ['./accepted-trackers-table.component.scss']
})
export class AcceptedTrackersTableComponent implements OnInit {
  @Input() data:Array<HrTracker> = [];
  @Input() isLoading:boolean = true;
  @Output() onSavingFinishedTrackerStatus= new EventEmitter<Partial<HrTracker>>();
  @ViewChild('trackerInboxTable', {static: false}) trackerInboxTable: any;
  @ViewChild('inputFilter', {static: false}) inputFilter: any;  
  filter='';  
  constructor() { }

  ngOnInit(): void {
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
  
  saveFinishedTrackerStatus(hrTracker:HrTracker){    
    let { _id } = hrTracker;
    this.onSavingFinishedTrackerStatus.emit(
      {      
        _id,    
        state: TRACKER_STATUS.DONE
      }
    );        
  }

  toggleExpandRow(row){
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }
}
