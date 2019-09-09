import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

export function fillInput(input: HTMLInputElement, value: any) {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

export function byCss(fixture: ComponentFixture<any>, selector: string) {
  return fixture.debugElement.query(By.css(selector)).nativeElement;
}
