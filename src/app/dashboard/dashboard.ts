import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from "@angular/material/card";
import { MatAnchor } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, MatCardModule, MatIconModule, RouterLink, MatAnchor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
