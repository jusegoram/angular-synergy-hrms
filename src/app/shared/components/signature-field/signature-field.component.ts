import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IMAGE_VALUES } from '@synergy/environments/enviroment.common';

/*
  Generated class for the SignatureField component.
  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

@Component({
  selector: 'signature-field',
  templateUrl: 'signature-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
  ],
})
export class SignatureFieldComponent implements ControlValueAccessor {
  @ViewChild('SignaturePad') public signaturePad: SignaturePad;

  public options: Object = {
    backgroundColor: 'rgb(245, 245, 245)',
    canvasWidth: 500,
    canvasHeight: 250,
  };

  public _signature: any = null;

  public propagateChange: Function = null;

  get signature(): any {
    return this._signature;
  }

  set signature(value: any) {
    this._signature = value;
    this.propagateChange(this.signature);
  }

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this._signature = value;
    this.signaturePad.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  // public ngAfterViewInit(): void {
  //    this.signaturePad.clear();
  // }

  public drawBegin(): void {}

  public drawComplete(): void {
    this.signature = this.signaturePad.toDataURL('image/jpeg', IMAGE_VALUES.QUALITY.MEDIUM);
  }

  public off(): void {
    this.signaturePad.off();
    this.drawComplete();
  }
  public on(): void {
    this.signaturePad.on();
  }
  public clear(): void {
    this.signaturePad.on();
    this.signaturePad.clear();
    this.signature = '';
  }
}
