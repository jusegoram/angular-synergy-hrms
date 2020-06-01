import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import * as XLSX from 'xlsx';
import { RangesFooterComponent } from '@synergy-app/shared/components';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals';
import { USER_ROLES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'report-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss'],
})
export class HoursComponent implements OnInit {
  @ViewChild('employeeInput') employeeInput: ElementRef<HTMLInputElement>;
  @ViewChild('onError', { static: false }) onError: OnErrorAlertComponent;
  clients = [];
  campaigns = [];
  employees = [];
  queryForm: FormGroup;
  rangesFooter = RangesFooterComponent;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  data: any[];
  columns: any[];
  columnMode = ColumnMode;
  auth;
  roles = USER_ROLES;
  constructor(private operationsService: OperationsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.buildTable();
    this.fetchClients();
    this.auth = this.operationsService.getDecodedToken();
  }
  buildForm(): void {
    this.queryForm = this.fb.group({
      date: [Validators.required],
      employeeId: [],
      client: [],
      campaign: [],
    });
  }
  buildTable() {
    this.columns = [
      { name: 'EMPLOYEE ID', prop: 'employeeId' },
      { name: 'DIALER ID', prop: 'dialerId' },
      { name: 'NAME', prop: 'employeeName' },
      { name: 'CLIENT', prop: 'client' },
      { name: 'CAMPAIGN', prop: 'campaign' },
      { name: 'DATE', prop: 'date' },
      { name: 'SYSTEM', prop: 'systemHours' },
      { name: 'TOS', prop: 'tosHours' },
      { name: 'BREAK', prop: 'breakHours' },
      { name: 'LUNCH', prop: 'lunchHours' },
      { name: 'TRAINING', prop: 'trainingHours' },
      { name: 'TIME IN', prop: 'timeIn' },
    ];
  }
  async fetchClients() {
    this.clients = await this.operationsService.getClient().toPromise();
  }
  onFilterRemoved(item: string, control?: string) {
    const items = this.queryForm.controls[control].value as string[];
    this.removeFirst(items, item);
    this.queryForm.controls[control].setValue(items);
  }

  removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  setCampaigns(event: any) {
    let currentCampaigns = [];
    event.forEach((i) => (currentCampaigns = [...currentCampaigns, ...i.campaigns]));
    this.campaigns = currentCampaigns;
  }
  addEmployee(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.employees.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.queryForm.controls['employeeId'].setValue(this.employees);
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.employees.push(event.option.viewValue);
    this.employeeInput.nativeElement.value = '';
    this.queryForm.controls['employeeId'].setValue(this.employees);
  }
  async populateTable() {
    try {
      const query = this.queryForm.value;
      query.client = query.client && query.client.map((client) => client.name);
      query.employeeId = query.employeeId && query.employeeId.length === 0 ? null : query.employeeId;
      query.client =
        query.client && query.client.length > 0 && query.client[0]
          ? query.client
          : this.auth.clients.length !== 0
          ? this.auth.clients
          : null;
      query.campaign = query.campaign && query.campaign.length === 0 ? null : query.campaign;
      this.data = await this.operationsService.getHours(query).toPromise();
    } catch (e) {
      await this.onError.fire();
    }
  }
  clearTable() {
    this.data = undefined;
  }

  export() {
    const mapped = this.data.map((i) => {
      const { _id, ...rest } = i;
      return rest;
    });
    try {
      const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mapped);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, main, 'sheet 1');
      XLSX.writeFile(wb, 'hours_' + new Date().toISOString() + '.xlsx');
    } catch (e) {
      this.onError.fire();
    }
  }
  async delete() {
    const mapped = this.data.map((i) => i._id);
    try {
      await this.operationsService.deleteHours(mapped).toPromise();
    } catch (e) {
      await this.onError.fire();
    }
  }
}
