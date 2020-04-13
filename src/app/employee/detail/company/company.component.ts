import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import {
  Employee,
  EmployeeCompany,
  Manager,
} from '../../../shared/models/employee/employee';
import { noop, Observable } from 'rxjs';

@Component({
  selector: 'company-info',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  @Input('authorization') auth;
  @Input('employee') employee: Employee;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  company: EmployeeCompany = {
    employee: '',
    client: '',
    campaign: '',
    manager: null,
    shiftManager: null,
    supervisor: null,
    trainer: null,
    branch: '',
    trainingGroupRef: '',
    trainingGroupNum: null,
    hireDate: null,
    terminationDate: null,
    reapplicant: false,
    reapplicantTimes: null,
    bilingual: false,
  };
  companyForm: FormGroup;
  clients: any;
  campaigns: any;
  managers: Manager[];
  shiftManagers: Manager[];
  trainers: Manager[];

  constructor(private _service: EmployeeService, private fb: FormBuilder) {}

  ngOnInit() {
    Object.assign(this.company, this.employee.company);
    this.fetchSuperiors(this.company.client);
    this.clients = this._service.getClient();
    this.campaigns = this.setCampaigns(this.company.client);
    this.buildForm();
  }
  buildForm() {
    const { _id: employee } = this.employee;
    const {
      client,
      campaign,
      shiftManager,
      manager,
      supervisor,
      trainer,
      branch,
      trainingGroupRef,
      trainingGroupNum,
      hireDate,
      terminationDate,
      reapplicant,
      reapplicantTimes,
      bilingual,
    } = this.company;
    this.companyForm = this.fb.group({
      employee: [employee],
      client: [client, Validators.required],
      campaign: [campaign, Validators.required],
      manager: [manager !== null ? manager.manager_id : ''],
      shiftManager: [shiftManager !== null ? shiftManager.manager_id : ''],
      supervisor: [supervisor !== null ? supervisor.manager_id : ''],
      trainer: [trainer !== null ? trainer.manager_id : '', Validators.required],
      branch: [branch, Validators.required],
      trainingGroupRef: ['GEN'],
      trainingGroupNum: [trainingGroupNum, Validators.required],
      hireDate: [hireDate, Validators.required],
      terminationDate: [terminationDate],
      reapplicant: [reapplicant],
      reapplicantTimes: [reapplicantTimes],
      bilingual: [bilingual],
    });
  }
  fetchSuperiors(client?) {
    client
      ? this._service.getEmployeeManagers([client]).subscribe((result: any) => {
          const { managers, shiftManagers, trainers } = result;
          this.managers = managers;
          this.shiftManagers = shiftManagers;
          this.trainers = trainers;
        })
      : noop();
  }
  async createCompany() {
    const { value: values } = this.companyForm;
    const query: EmployeeCompany = {
      ...values,
    };
    query.manager =
      values.manager === this.company.manager.manager_id
        ? this.company.manager
        : this.managerResolver(values.manager);
    query.shiftManager =
      values.shiftManager === this.company.shiftManager.manager_id
        ? this.company.shiftManager
        : this.shiftManagerResolver(values.shiftManager);
    query.supervisor =
      values.supervisor === this.company.supervisor.manager_id
        ? this.company.supervisor
        : this.shiftManagerResolver(values.supervisor);
    query.trainer =
      values.trainer === this.company.trainer.manager_id
        ? this.company.trainer
        : this.trainerResolver(values.trainer);
    try {
      delete query._id;
      await this._service.saveCompany(query).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }
  async updateCompany() {
    const { value: values } = this.companyForm;

    const query: EmployeeCompany = {
      ...values,
    };
    query.manager =
      values.manager === this.company.manager.manager_id
        ? this.company.manager
        : this.managerResolver(values.manager);
    query.shiftManager =
      values.shiftManager === this.company.shiftManager.manager_id
        ? this.company.shiftManager
        : this.shiftManagerResolver(values.shiftManager);
    query.supervisor =
      values.supervisor === this.company.supervisor.manager_id
        ? this.company.supervisor
        : this.shiftManagerResolver(values.supervisor);
    query.trainer =
      values.trainer === this.company.trainer.manager_id
        ? this.company.trainer
        : this.trainerResolver(values.trainer);
    try {
      delete query._id;
      await this._service.updateCompany(query).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  async setCampaigns($event: string) {
    this.fetchSuperiors($event);
    try {
      const clients = await this._service.getClient().toPromise();
      if (clients) {
        const i = clients.findIndex((result) => result.name === $event);
        if (i >= 0) {
          return clients[i].campaigns;
        } else {
          return [];
        }
      }
    } catch (e) {
      return [];
    }
  }
  managerResolver(_id) {
    const date = new Date();
    const [found] = this.managers.filter((i) => i.manager_id === _id);
    this.company.manager.date = date;
    found.date = date;
    return found;
  }
  shiftManagerResolver(_id) {
    const date = new Date();
    const [found] = this.shiftManagers.filter((i) => i.manager_id === _id);
    this.company.shiftManager.date = date;
    found.date = date;
    return found;
  }
  trainerResolver(_id) {
    const date = new Date();
    const [found] = this.trainers.filter((i) => i.manager_id === _id);
    this.company.trainer.date = date;
    found.date = date;    return found;
  }
  refreshCampaigns(value: string) {
    this.campaigns = this.setCampaigns(value);
  }
  onSubmit() {
    if (this.companyForm.valid && this.companyForm.touched) {
      return this.companyForm.value._id !== ''
        ? this.updateCompany()
        : this.createCompany();
    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}
