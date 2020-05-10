import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AdminService } from '@synergy-app/core/services';
import { Component, ElementRef, Inject, OnInit, ViewChild, } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from '@synergy-app/shared/models';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent implements OnInit {
  items: Array<any>;
  form: FormGroup;
  hide = true;
  edit = false;
  create = false;
  delete = false;
  export = false;
  upload = false;
  employees: Employee[];
  employee: string;
  filteredEmployees: Observable<Employee[]>;
  employeeCtrl = new FormControl();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  pagesCtrl = new FormControl();
  filteredPages: Observable<any[]>;
  pages: string[] = [];
  allPages: any[] = [];

  clientsCtrl = new FormControl();
  filteredClients: Observable<any[]>;
  clients: string[] = [];
  allClients: any[] = [];
  @ViewChild('pageInput', {static: false}) pageInput: ElementRef<HTMLInputElement>;
  @ViewChild('pageAuto', {static: false}) matAutocomplete: MatAutocomplete;

  @ViewChild('clientInput', {static: false}) clientInput: ElementRef<HTMLInputElement>;
  @ViewChild('clientAuto', {static: false})
  matClientAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private _adminService: AdminService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredPages = this.pagesCtrl.valueChanges.pipe(
      startWith(null),
      map((page: string | null) => (page ? this._filter(page) : this.allPages.slice()))
    );

    this.filteredClients = this.clientsCtrl.valueChanges.pipe(
      startWith(null),
      map((client: string | null) => (client ? this._filterClient(client) : this.allClients.slice()))
    );
  }
  ngOnInit() {
    this.getAllPages();
    this.getAllClients();
    this.items = this._adminService.userTypes;

    this.form = this.fb.group({
      fn: [this.data.firstName],
      ln: [this.data.lastName],
      role: [this.data.role],
      username: [this.data.username],
      password: ['', Validators.minLength(10)],
      confirmPw: ['', Validators.minLength(10)],
    });
    this.edit = this.data.rights ? this.data.rights.edit : false;
    this.create = this.data.rights ? this.data.rights.create : false;
    this.delete = this.data.rights ? this.data.rights.delete : false;
    this.export = this.data.rights ? this.data.rights.export : false;
    this.upload = this.data.rights ? this.data.rights.upload : false;
    this._adminService.getEmployees().subscribe((data) => {
      data.map((item) => {
        item.fullSearchName =
          '(' + item.employeeId + ') ' + item.firstName + ' ' + item.middleName + ' ' + item.lastName;
      });
      this.employees = data;
    });
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.employees ? this._filterEmployees(value) : this.employees;
      })
    );
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employees.filter((employee) => {
      return employee['fullSearchName'].toLowerCase().includes(filterValue);
    });
  }

  getAllPages() {
    this._adminService.getAllMenus().subscribe((result) => {
      this.allPages = result;
      this.pages = this.pagesPagetoName(this.data.pages);
    });
  }

  pagesNametoPage(name: string[]): number[] {
    const result: number[] = [];
    name.forEach((n) => {
      const found = this.allPages.find((item) => item.name.localeCompare(n) === 0);
      result.push(found.page);
    });
    return result;
  }
  pagesPagetoName(page: number[]): string[] {
    const result: string[] = [];
    page.forEach((p) => {
      const found = this.allPages.find((item) => item.page === p);
      if (found !== undefined) {
        result.push(found.name);
      }
    });
    return result;
  }

  getAllClients() {
    this._adminService.getClient().subscribe((result) => {
      this.allClients = result;
      this.clients = this.data.clients;
    });
  }

  onSave() {
    const formValue = this.form.value;
    const user = {
      _id: this.data._id,
      firstName: formValue.fn,
      lastName: formValue.ln,
      username: formValue.username,
      pages: this.pagesNametoPage(this.pages),
      clients: this.clients,
      role: formValue.role,
      rights: {
        edit: this.edit,
        create: this.create,
        delete: this.delete,
        export: this.export,
        upload: this.upload,
      },
      password: formValue.password,
      employee: this.employee,
    };
    this.dialogRef.close(user);
  }

  verifyPassword() {
    this.form.valueChanges.subscribe((field) => {
      if (this.form.value.password !== this.form.value.confirmPw) {
        this.form.controls.confirmPw.setErrors({ mismatch: true });
      } else {
        this.form.controls.confirmPw.setErrors(null);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    // Add page only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our page
      if ((value || ('' && !this.pages.includes(value))).trim()) {
        this.pages.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.pagesCtrl.setValue(null);
    }
  }

  remove(page: string): void {
    const index = this.pages.indexOf(page);

    if (index >= 0) {
      this.pages.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.pages.includes(event.option.viewValue)) {
      this.pages.push(event.option.viewValue);
    }
    this.pageInput.nativeElement.value = '';
    this.pagesCtrl.setValue(null);
  }

  private _filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allPages.filter((page) => {
      return page['name'].toLowerCase().includes(filterValue);
    });
  }

  addClient(event: MatChipInputEvent): void {
    // Add page only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matClientAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our page
      if ((value || ('' && !this.clients.includes(value))).trim()) {
        this.clients.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.clientsCtrl.setValue(null);
    }
  }

  removeClient(client: string): void {
    const index = this.clients.indexOf(client);

    if (index >= 0) {
      this.clients.splice(index, 1);
    }
  }

  selectedClient(event: MatAutocompleteSelectedEvent): void {
    if (!this.clients.includes(event.option.viewValue)) {
      this.clients.push(event.option.viewValue);
    }
    this.clientInput.nativeElement.value = '';
    this.clientsCtrl.setValue(null);
  }

  private _filterClient(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allClients.filter((client) => {
      return client['name'].toLowerCase().includes(filterValue);
    });
  }
}
