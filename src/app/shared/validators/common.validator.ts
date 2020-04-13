import { FormControl } from '@angular/forms';

export class CommonValidator {
  static emptyFieldValidator(control: FormControl): any {
    if (!control.value.trim()) {
      return { 'field should not be empty': true };
    }
    return null;
  }
}
