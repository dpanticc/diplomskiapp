import { Component, OnInit } from '@angular/core';
import { UserService, PeriodicElement } from 'src/app/services/user/user.service';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AccountComponent } from '../account/account.component';


@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports:[MatTableModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, CommonModule]
})
export class UsersComponent implements OnInit {
  dataSource: PeriodicElement[] = [];
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'enabled', 'delete'];
  filteredDataSource: PeriodicElement[] = []; 
  searchInput: string = '';


  constructor(private userService: UserService, private dialog: MatDialog, private notificationService: NotificationService ) {

  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource = users;
      this.applyFilter(); // Apply initial filter

    });
  }

  applyFilter(): void {
    this.filteredDataSource = this.dataSource.filter((user) => {
      // Customize this condition based on your filtering requirements
      return (
        user.username.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    });
  }

  onDelete(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: `Are you sure you want to delete ${element.username}'s account?`,
      },
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const username = element.username; // Assuming 'username' is the unique identifier for a user
        this.userService.deleteUser(username).subscribe(
          () => {
            console.log('User deleted successfully.');
            this.fetchUsers();
            this.notificationService.getMessage("User deleted successfully.");
          },
          (error: any) => {
            console.error('Error deleting user:', error);
          }
        );
      }
    });
  }

  openEditDialog() {
    
    const dialogRef = this.dialog.open(AccountComponent, {
     
    width: "742px",
      data: {/* pass any data if needed */}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.fetchUsers();
    });
  }
}

