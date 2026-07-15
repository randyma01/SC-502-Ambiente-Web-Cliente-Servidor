import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-background.html',
  styleUrl: './page-background.scss'
})
export class PageBackground {
  startColor = input<string>('#EBF5FF');
  endColor = input<string>('#EDE8FF');
}
