import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AllergenService } from '../../services/allergen.service';
import { DietService } from '../../services/diet.service';
@Component({ selector: 'app-register', templateUrl: './register.component.html' })
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  allergies: number[] = [];
  dietId: number;
  allergens: any[] = [];
  diets: any[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private allergenService: AllergenService,
    private dietService: DietService
  ) {}
  ngOnInit() {
    this.allergenService.getAllAllergens().subscribe((allergens) => (this.allergens = allergens));
    this.dietService.getAllDiets().subscribe((diets) => (this.diets = diets));
  }
  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      allergies: this.allergies,
      dietId: this.dietId,
    };
    this.authService.register(user).subscribe(() => this.router.navigate(['/dashboard']));
  }
}
