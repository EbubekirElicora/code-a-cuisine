import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss', './hero-responsive.component.scss'],
})
export class HeroComponent {}
