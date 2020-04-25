import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { HttpClientModule } from '@angular/common/http';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { RangesFooterComponent } from './ranges-footer/ranges-footer.component';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from './material.shared.module';
import { TrackerStatusPipe } from './pipes/tracker-status.pipe';
import { TrackerTypePipe } from './pipes/tracker-type.pipe';
import { FileInputSelectorComponent } from './components/file-input-selector/file-input-selector.component';
import { LeaveStatusPipe } from './pipes/leave-status.pipe';
import { DeniedAccessComponent } from '@synergy-app/shared/denied-access/denied-access.component';
import { ExportComponent } from '@synergy-app/shared/export/export.component';
import { ExportService } from '@synergy-app/shared/export/export.service';
import { ModalsModule } from '@synergy-app/shared/modals/modals.module';

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
    TrackerStatusPipe,
    TrackerTypePipe,
    LeaveStatusPipe,
    RangesFooterComponent,
    FileInputSelectorComponent,
    DeniedAccessComponent,
    ExportComponent,
  ],
  imports: [
    HttpClientModule,
    SignaturePadModule,
    CommonModule,
    MaterialSharedModule,
    ModalsModule,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
    LeaveStatusPipe,
    RangesFooterComponent,
    FileInputSelectorComponent,
    DeniedAccessComponent,
    ExportComponent,
  ],
  providers: [MenuItems, TrackerStatusPipe, TrackerTypePipe, ExportService],
})
export class SharedModule {}
