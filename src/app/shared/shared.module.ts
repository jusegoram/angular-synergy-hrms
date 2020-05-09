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
import { DeniedAccessComponent } from '@synergy-app/shared/components/denied-access/denied-access.component';
import { ExportComponent } from '@synergy-app/shared/components/export/export.component';
import { ExportService } from '@synergy-app/shared/services/export.service';
import { ModalsModule } from '@synergy-app/shared/modals';
import { MinuteSecondsPipe, MinutesHoursPipe } from './pipes';

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
    TrackerStatusPipe,
    TrackerTypePipe,
    LeaveStatusPipe,
    MinuteSecondsPipe,
    MinutesHoursPipe,
  ],
  imports: [SignaturePadModule, CommonModule, MaterialSharedModule, ModalsModule],
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
  ],
  providers: [MenuService, TrackerStatusPipe, TrackerTypePipe, ExportService],
})
export class SharedModule {}
