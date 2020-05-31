import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, AsyncPipe } from '@angular/common';
import { ConceptsPageRoutingModule } from './concepts-page-routing.module';
import { ConceptsPageComponent } from './concepts-page.component';
import { MaterialSharedModule, SharedModule } from '@synergy-app/shared';
import { NewConceptComponent } from './components/new-concept/new-concept.component';
import { ConceptVerificationComponent } from './containers/concept-verification/concept-verification.component';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CertifiedLeavesListComponent } from './components/certified-leaves-list/certified-leaves-list.component';
import { OnFinalpaymentComponent } from './containers/on-finalpayment/on-finalpayment.component';

@NgModule({
  declarations: [
    ConceptsPageComponent,
    NewConceptComponent,
    ConceptVerificationComponent,
    CertifiedLeavesListComponent,
    OnFinalpaymentComponent
  ],
  imports: [
    CommonModule,
    ConceptsPageRoutingModule,
    MaterialSharedModule,
    NgxDatatableModule,
    FormsModule,
    SharedModule,
  ],
  providers: [PayrollService, DatePipe, CurrencyPipe, AsyncPipe],
})
export class ConceptsPageModule {}
