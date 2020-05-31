import { NgModule } from '@angular/core';

import { MenuService } from './services/menu.service';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from './directives';
import { ToggleFullscreenDirective } from './directives/fullscreen/toggle-fullscreen.directive';
import { SignatureFieldComponent } from './components/signature-field/signature-field.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { RangesFooterComponent } from './components/ranges-footer/ranges-footer.component';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from './material.shared.module';
import { TrackerStatusPipe } from './pipes/tracker-status.pipe';
import { TrackerTypePipe } from './pipes/tracker-type.pipe';
import { FileInputSelectorComponent } from './components/file-input-selector/file-input-selector.component';
import { LeaveStatusPipe } from './pipes/leave-status.pipe';
import {
  ExportComponent,
  PageTitleComponent,
  DeniedAccessComponent,
  AvatarComponent,
  ExportBottomSheetComponent,
} from '@synergy-app/shared/components';
import { ExportService } from '@synergy-app/shared/services/export.service';
import {
  OnDeleteAlertComponent,
  OnErrorAlertComponent,
  OnSuccessAlertComponent,
  GenerateLeaveModalComponent,
  PdfViewerComponent,
  PayslipDialogComponent,
} from '@synergy-app/shared/modals';
import { MinuteSecondsPipe, MinutesHoursPipe } from './pipes';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { ExportAsModule } from 'ngx-export-as';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export function provideSwal() {
  return import('sweetalert2/src/sweetalert2.js'); // instead of import('sweetalert2')
}

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    RangesFooterComponent,
    FileInputSelectorComponent,
    DeniedAccessComponent,
    ExportComponent,
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent,
    GenerateLeaveModalComponent,
    PdfViewerComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
    LeaveStatusPipe,
    MinuteSecondsPipe,
    MinutesHoursPipe,
    PageTitleComponent,
    AvatarComponent,
    ExportBottomSheetComponent,
    PayslipDialogComponent,
  ],
  imports: [
    SignaturePadModule,
    CommonModule,
    MaterialSharedModule,
    SweetAlert2Module.forRoot({ provideSwal }),
    FormsModule,
    ExportAsModule,
    MatDialogModule,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    RangesFooterComponent,
    FileInputSelectorComponent,
    DeniedAccessComponent,
    ExportComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
    LeaveStatusPipe,
    MinuteSecondsPipe,
    MinutesHoursPipe,
    OnDeleteAlertComponent,
    OnErrorAlertComponent,
    OnSuccessAlertComponent,
    GenerateLeaveModalComponent,
    PdfViewerComponent,
    PageTitleComponent,
    AvatarComponent,
    SweetAlert2Module,
  ],
  providers: [
    MenuService,
    TrackerStatusPipe,
    TrackerTypePipe,
    ExportService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  entryComponents: [
    GenerateLeaveModalComponent,
    PdfViewerComponent,
    ExportBottomSheetComponent,
    PayslipDialogComponent,
  ],
})
export class SharedModule {}
