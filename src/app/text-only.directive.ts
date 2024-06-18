// only-text.directive.ts
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyText]',
  standalone:true
})
export class OnlyTextDirective {

  private regex: RegExp = new RegExp(/^[a-zA-Z\s]*$/);

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let inputValue: string = input.value;
    if (!this.regex.test(inputValue)) {
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
      this.control.control?.setValue(inputValue);
    }
  }
}
