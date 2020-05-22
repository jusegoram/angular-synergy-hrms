import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'report-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss'],
})
export class MatrixComponent implements OnInit, OnDestroy {
  @ViewChild('positionInput', {static: false}) positionInput: ElementRef<HTMLInputElement>;
  @ViewChild('positionAuto', {static: false})
  matPositionAutocomplete: MatAutocomplete;
  results: any[] = [];
  clients = [];
  campaigns = [];
  CurrentTime: Observable<Date>;
  queryForm: FormGroup;
  startOfWeek = moment().startOf('week');
  endOfWeek = moment().endOf('week').add(1, 'day');

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredPositions: Observable<any[]>;
  positions: string[] = [];
  allPositions: any[] = [];
  positionsMap: any = {};
  timeInterval: Subscription;
  constructor(
    private operationsService: OperationsService,
    private fb: FormBuilder,
    private exportAsService: ExportAsService
  ) {
    this.CurrentTime = this.operationsService.getClock();
    this.buildForm();
    this.filteredPositions = this.queryForm.controls.position.valueChanges.pipe(
      startWith(null),
      map((position: string | null) => (position ? this._filterPosition(position) : this.allPositions.slice()))
    );
  }

  ngOnInit() {
    this.getPositions();
    this.getClients();
  }
  getClients() {
    this.operationsService.getClient().subscribe((result) => (this.clients = result));
  }
  getPositions() {
    this.operationsService.getDepartment().subscribe((result: any[]) => {
      const filtered: any[] = [].concat.apply(
        [],
        result
          .filter(
            (item) =>
              item.name === 'Operations' ||
              item.name === 'Production' ||
              item.name === 'Training'
          )
          .filter((item) => item.name === 'Operations' || item.name === 'Production' || item.name === 'Training')
          .map((item) => item.positions)
          .sort()
      );
      this.allPositions = filtered.map((item) => {
        delete item._id;
        delete item.__v;
        delete item.baseWage;
        return item;
      });
      filtered
        .map((i) => {
          i.mapInput = {};
          i.mapInput[i.name] = i.positionId;
          return i.mapInput;
        })
        .forEach((i) => {
          Object.assign(this.positionsMap, i);
        });
    });
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day === TIME_VALUES.WEEK.MONDAY || day === TIME_VALUES.WEEK.TUESDAY || day === TIME_VALUES.WEEK.SUNDAY;
  }

  buildForm() {
    this.queryForm = this.fb.group({
      client: ['', Validators.required],
      campaign: ['', Validators.required],
      from: [this.startOfWeek.toDate(), Validators.required],
      to: [this.endOfWeek.toDate(), Validators.required],
      position: [''],
    });
  }

  setCampaigns(event: any) {
    this.queryForm.value.Campaign = '';
    this.campaigns = event.campaigns;
  }

  onLoadMatrix() {
    const { client, campaign, from, to } = this.queryForm.value;
    this.loadMatrix(
      client.name,
      campaign,
      moment(from).format('MM/DD/YYYY').toString(),
      moment(to).format('MM/DD/YYYY').toString(),
      this.positions
    );
  }

  loadMatrix(client, campaign, from, to, positions) {
    const queryPositions = positions.map((i) => {
      i = this.positionsMap[i];
      return i;
    });
    this.operationsService.getMatrix(client, campaign, from, to, queryPositions).subscribe((result: any[]) => {
      this.results = [];
      result.forEach((i) => {
        let mappedResult: { values; keys; header };

        mappedResult = {
          values: Object.values(i),
          keys: Object.keys(i),
          header: Date(),
        };
        mappedResult.keys.shift();
        mappedResult.keys = mappedResult.keys.map((key: string) => {
          return parseInt(key.split('-')[0], 10);
        });
        mappedResult.header = moment(mappedResult.values.shift()).toDate();
        this.results.push(mappedResult);
      });
    });
  }

  addPosition(event: MatChipInputEvent): void {
    // Add page only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matPositionAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our page
      if ((value || ('' && !this.positions.includes(value))).trim()) {
        this.positions.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.queryForm.controls.position.setValue(null);
    }
  }

  removePosition(position: string): void {
    const index = this.positions.indexOf(position);

    if (index >= 0) {
      this.positions.splice(index, 1);
    }
  }

  selectedPosition(event: MatAutocompleteSelectedEvent): void {
    if (!this.positions.includes(event.option.viewValue)) {
      this.positions.push(event.option.viewValue);
    }
    this.positionInput.nativeElement.value = '';
    this.queryForm.controls.position.setValue(null);
  }

  private _filterPosition(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allPositions.filter((position) => {
      return position['name'].toLowerCase().includes(filterValue);
    });
  }

  exportAs(type) {
    const config: ExportAsConfig = {
      type: type,
      elementIdOrContent: 'matrix',
    };
    this.exportAsService
      .save(
        config,
        `${this.startOfWeek.format('MM-DD-YY').toString()}_${this.endOfWeek.format('MM-DD-YY').toString()}_MATRIX`
      )
      .subscribe(() => {});
  }

  ngOnDestroy() {}
}
