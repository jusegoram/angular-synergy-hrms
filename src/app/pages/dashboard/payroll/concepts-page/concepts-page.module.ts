import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ConceptsPageRoutingModule } from './concepts-page-routing.module';
import { ConceptsPageComponent } from './concepts-page.component';
import { MaterialSharedModule } from '@synergy-app/shared';
import { NewConceptComponent } from './new-concept/new-concept.component';
// tslint:disable-next-line:max-line-length
import { ConceptVerificationComponent } from './concept-verification/concept-verification.component';
import { LeavesComponent } from './leaves/leaves.component';
import { PayrollService } from '../services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConceptsPageComponent, NewConceptComponent, ConceptVerificationComponent, LeavesComponent],
  imports: [CommonModule, ConceptsPageRoutingModule, MaterialSharedModule, NgxDatatableModule, FormsModule],
  providers: [PayrollService, DatePipe, CurrencyPipe]
})
export class ConceptsPageModule {}
