import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.results ?? [];
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios', error);
      }
    });
  }
}