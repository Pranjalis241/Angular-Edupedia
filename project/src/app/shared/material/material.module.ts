import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatButtonModule } from '@angular/material/button'; // If you use buttons
import { MatIconModule } from '@angular/material/icon'; // If you use icons
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    BrowserAnimationsModule, // Required for Material animations
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,  
    MatBadgeModule 
  ],
  exports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    BrowserAnimationsModule, // Required for Material animations
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,  
    MatBadgeModule 
  ]
})
export class MaterialModule {
 
 }
