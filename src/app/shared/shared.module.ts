import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective, } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { HttpClientModule } from '@angular/common/http';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { RangesFooterComponent } from './ranges-footer/ranges-footer.component';
import { CommonModule } from '@angular/common';
import { MaterialSharedModule } from './material.shared.module';
import { TrackerStatusPipe } from './pipes/tracker-status.pipe';
import { TrackerTypePipe } from './pipes/tracker-type.pipe';

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
    RangesFooterComponent,
  ],
  imports: [
    HttpClientModule,
    SignaturePadModule,
    CommonModule,
    MaterialSharedModule,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
    RangesFooterComponent
  ],
  providers: [MenuItems, TrackerStatusPipe, TrackerTypePipe],
})
export class SharedModule {}
