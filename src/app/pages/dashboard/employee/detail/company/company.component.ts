import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { Employee, EmployeeCompany, Manager } from '@synergy-app/shared/models/employee/employee';
import { noop } from 'rxjs';

@Component({
  selector: 'company-info',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('authorization') auth;
  // tslint:disable-next-line:no-input-rename
  @Input('employee') currentEmployee: Employee;
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
  supervisors: Manager[];
  trainers: Manager[];

  constructor(private _service: EmployeeService, private fb: FormBuilder) {}

  ngOnInit() {
    Object.assign(this.company, this.currentEmployee.company);
    this.fetchSuperiors(this.company.client);
    this.clients = this._service.getClient();
    this.campaigns = this.setCampaigns(this.company.client);
    this.buildForm();
  }
  buildForm() {
    const { _id: employee } = this.currentEmployee;
    const {
      _id,
      client,
      campaign,
      shiftManager,
      manager,
      supervisor,
      trainer,
      branch,
      trainingGroupNum,
      hireDate,
      terminationDate,
      reapplicant,
      reapplicantTimes,
      bilingual,
    } = this.company;
    this.companyForm = this.fb.group({
      _id: [_id],
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
          const { managers, shiftManagers, trainers, supervisors} = result;
          this.managers = managers;
          this.shiftManagers = shiftManagers;
          this.supervisors = supervisors;
          this.trainers = trainers;
        })
      : noop();
  }
  async createCompany() {
    const { value: values } = this.companyForm;
    const query: EmployeeCompany = {
      ...values,
    };
    query.manager = this.managerResolver(values.manager);
    query.shiftManager = this.shiftManagerResolver(values.shiftManager);
    query.supervisor = this.supervisorResolver(values.supervisor);
    query.trainer = this.trainerResolver(values.trainer);
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
    query.manager = this.company.manager && this.company.manager.manager_id === values.manager
      ? this.company.manager
      : this.managerResolver(values.manager);
    query.shiftManager =
      this.company.shiftManager && this.company.shiftManager.manager_id === values.shiftManager
        ? this.company.shiftManager
        : this.shiftManagerResolver(values.shiftManager);
    query.supervisor =
      this.company.supervisor && this.company.supervisor.manager_id === values.supervisor
        ? this.company.supervisor
        : this.supervisorResolver(values.supervisor);
    query.trainer =
      this.company.trainer && this.company.trainer.manager_id === values.trainer
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
  managerResolver(_id: string) {
    const date = new Date();
    const [found] = this.managers.filter((i) => i.manager_id === _id);
    if (found) {
      this.company.manager = found;
      this.company.manager.date = date;
      found.date = date;
      return found;
    } else {
      return null;
    }
  }
  supervisorResolver(_id: string) {
    const date = new Date();
    const [found] = this.supervisors.filter((i) => i.manager_id === _id);
    if (found) {
      this.company.supervisor = found;
      this.company.supervisor.date = date;
      found.date = date;
      return found;
    } else {
      return null;
    }
  }
  shiftManagerResolver(_id: string) {
    const date = new Date();
    const [found] = this.shiftManagers.filter((i) => i.manager_id === _id);
    if (found) {
      this.company.shiftManager = found;
      this.company.shiftManager.date = date;
      found.date = date;
      return found;
    } else {
      return null;
    }
  }
  trainerResolver(_id: string) {
    const date = new Date();
    const [found] = this.trainers.filter((i) => i.manager_id === _id);
    if (found) {
      this.company.trainer = found;
      this.company.trainer.date = date;
      found.date = date;
      return found;
    } else {
      return null;
    }
  }
  refreshCampaigns(value: string) {
    this.campaigns = this.setCampaigns(value);
  }
  onSubmit() {
    if (this.companyForm.valid && this.companyForm.touched) {
      return !!this.company._id
        ? this.updateCompany()
        : this.createCompany();
    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}
