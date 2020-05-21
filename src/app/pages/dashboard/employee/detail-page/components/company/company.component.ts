import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeCompany, Manager } from '@synergy-app/shared/models';
import { noop } from 'rxjs';

@Component({
  selector: 'app-company-info',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('authorization') auth;
  // tslint:disable-next-line:no-input-rename
  @Input('employee') currentEmployee: Employee;
  @Input()
  set superiors(superiors) {
    if (superiors) {
      const { managers, shiftManagers, trainers, supervisors } = superiors;
      this.managers = managers;
      this.shiftManagers = shiftManagers;
      this.supervisors = supervisors;
      this.trainers = trainers;
    }
  }
  @Output() onSuperiorsDataRequest = new EventEmitter<any>();
  @Output() onSubmitButtonClicked = new EventEmitter<{ company: EmployeeCompany; shouldUpdateCompany: boolean }>();
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
  @Input() clients: any;
  campaigns: any;
  managers: Manager[];
  shiftManagers: Manager[];
  supervisors: Manager[];
  trainers: Manager[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    Object.assign(this.company, this.currentEmployee.company);
    this.requestSuperiors(this.company.client);
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

  requestSuperiors(client?) {
    client ? this.onSuperiorsDataRequest.emit(client) : noop();
  }

  getNewCompany() {
    const { value: values } = this.companyForm;
    const query: EmployeeCompany = {
      ...values,
    };
    query.manager = this.managerResolver(values.manager);
    query.shiftManager = this.shiftManagerResolver(values.shiftManager);
    query.supervisor = this.supervisorResolver(values.supervisor);
    query.trainer = this.trainerResolver(values.trainer);
    delete query._id;
    return query;
  }

  getCompanyToUpdate(): EmployeeCompany {
    const { value: values } = this.companyForm;
    const query: EmployeeCompany = {
      ...values,
    };

    query.manager =
      this.company.manager && this.company.manager.manager_id === values.manager
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
    delete query._id;
    return query;
  }

  setCampaigns($event: string) {
    this.requestSuperiors($event);
    try {
      if (this.clients) {
        const i = this.clients.findIndex((result) => result.name === $event);
        if (i >= 0) {
          return this.clients[i].campaigns;
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
      const shouldUpdateCompany = !!this.company._id;
      const company = shouldUpdateCompany ? this.getCompanyToUpdate() : this.getNewCompany();
      this.onSubmitButtonClicked.emit({
        company,
        shouldUpdateCompany,
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}
