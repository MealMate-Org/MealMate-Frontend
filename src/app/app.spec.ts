import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
=======
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
>>>>>>> f364141439f5e0194a97af8b02c7e02d2daa1297
    }).compileComponents();
  });

  it('should create the app', () => {
<<<<<<< HEAD
    const fixture = TestBed.createComponent(App);
=======
    const fixture = TestBed.createComponent(AppComponent);
>>>>>>> f364141439f5e0194a97af8b02c7e02d2daa1297
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

<<<<<<< HEAD
  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, MealMate-Frontend');
=======
  it('should have title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('MealMate');
>>>>>>> f364141439f5e0194a97af8b02c7e02d2daa1297
  });
});
