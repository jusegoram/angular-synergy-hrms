import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { HttpClientModule } from '@angular/common/http';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TrackerStatusPipe } from './pipes/tracker-status.pipe';
import { TrackerTypePipe } from './pipes/tracker-type.pipe';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
  ],
  imports: [HttpClientModule, SignaturePadModule],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    SignatureFieldComponent,
    TrackerStatusPipe,
    TrackerTypePipe,
  ],
  providers: [MenuItems, TrackerStatusPipe, TrackerTypePipe],
})
export class SharedModule {}
