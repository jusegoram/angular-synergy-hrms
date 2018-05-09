import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Department, Position, Client, Campaign } from './models/positions-models';
import { AdminService } from '../services/admin.services';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  
  public departments: Department[];
  public clients: Client[];
  public currentDep: Department;
  public currentCli: Client;
  public newDep: string;
  public newCli: string;
  public newPos: Position;
  public newCam: Campaign;
  

  selectedDep = 'New';
  selectedCli= 'New';


  panelState = false;



  constructor(private _admService: AdminService, private snackBar: MatSnackBar) {
    this.newPos = new Position("","","", null);
    this.newCam = new Campaign("","");
   }

  ngOnInit() {
    this.departments = [
      { state: "default",
        id: "",
        name: "New",
        positions: []
      }
    ];

    this.clients = [
      { state: "default",
        id:"",
        name: "New",
        campaigns: []
      }
    ];

    this._admService.getDepartment().subscribe((results: Department[]) => {
      for(let result of results){
        this.departments.push(result);
        
      }
    });

    this._admService.getClient().subscribe((results: Client[]) => {
      for(let result of results){
        this.clients.push(result);
        console.log(this.clients);
      }
    });
    
  }

  getSelectedDep(): Department {
    let found: Department;
    let name = this.selectedDep;
    found = this.departments.find(result => { 
      return result.name === name;
    });
    this.currentDep = found;
    this.newDep = this.currentDep.name;
    return found;
  }

  getSelectedCli(): Client {
    let found: Client;
    let name = this.selectedCli;
    found = this.clients.find(result => { 
      return result.name === name;
    });
    this.currentCli = found;
    this.newCli = this.currentCli.name;
    return found;
  }

  onAddDep(){
    
    let i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if(i >= 0){
    this.currentDep.positions.push(this.newPos);
    if(this.departments[i].id === ""){
      this.departments[i].state = "new";
    }else{
      this.departments[i].state = "newPosition";
    }
    
    this.departments[i].positions = this.currentDep.positions;

    console.log(this.departments);
    this.newPos = new Position("","","", null);
    }else {
      let submitted = new Department("new","", this.newDep, [])
      submitted.positions.push(this.newPos);
      this.departments.push(submitted);
      console.log(this.departments)
      this.newPos = new Position("","","", null);
    }
  }

  onAddCli(){
    
    let i = this.clients.findIndex(result => {
      return result.name === this.newCli;
    });
    if(i >= 0){
    this.currentCli.campaigns.push(this.newCam);
    if(this.clients[i].id === ""){
      this.clients[i].state = "new";
    }else{
      this.clients[i].state = "newPosition";
    }
    this.clients[i].campaigns = this.currentCli.campaigns;

    console.log(this.clients);
    this.newCam = new Campaign("","");
    }else {
      let submitted = new Client("new","", this.newCli, [])
      submitted.campaigns.push(this.newCam);
      this.clients.push(submitted);
      console.log(this.departments)
      this.newCam = new Campaign("","");
    }
  }

  onChangesDep(){
    let i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if(this.departments[i].id === ""){
      this.departments[i].state = "new"
    } else if ( this.departments[i].state !== "modified" ){
      this.departments[i].state = "modified"
    }
    
  }

  onChangesCli(){
    let i = this.clients.findIndex(result => {
      return result.name === this.newCli;
    });
    if(this.clients[i].id === ""){
      this.clients[i].state = "new"
    } else if ( this.clients[i].state === "saved" ){
      this.clients[i].state = "modified"
    }
    
  }

  onSaveDep(){
    for(let i = 0; i < this.departments.length; i++ ) { 
      if(this.departments[i].state === "new"){
        //save admService
        this._admService.saveDepartment(this.departments[i])
        .subscribe(result => {
          this.departments[i].state = "saved";
        });
        console.log("new identified");
      }else if(this.departments[i].state === "newPosition"){
        this._admService.updateDepartment(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Departments information updated successfully', 'thank you', {
              duration: 2000,
            });          
            this.departments[i].state = "saved";
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
        console.log("new position identified");
      }else if(this.departments[i].state === "modified") {
        console.log(this.departments[i]);
        this._admService.updateDepartment(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Departments information updated successfully', 'thank you', {
              duration: 2000,
            });          
            this.departments[i].state = "saved";
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
        console.log("modified identified");
      }
    }
  }

  onSaveCli(){
    for(let i = 0; i < this.clients.length; i++ ) { 
      if(this.clients[i].state === "new"){
        //save admService
        this._admService.saveClient(this.clients[i])
        .subscribe(result => {
          this.clients[i].state = "saved";
        });
        console.log("new identified");
      }else if(this.clients[i].state === "newPosition"){
        this._admService.updateClient(this.clients[i]).subscribe(result => {
          this.departments[i].state = "saved";
        });
        console.log("new position identified");
      }else if(this.clients[i].state === "modified") {
        console.log(this.clients[i]);
        this._admService.updateClient(this.clients[i]).subscribe(result => {
          this.departments[i].state = "saved";
        console.log("modified identified");
        });
      }
    }
  }
}
