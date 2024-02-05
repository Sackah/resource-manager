import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../../user/services/settings.service';
import { selectCurrentUser } from '../../../../auth/store/authorization/AuthReducers';
import {
  CurrentUser,
  Departments,
  InitialSig,
  Specializations,
} from '../../../../shared/types/types';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
@Component({
  selector: 'app-work-specialization',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './work-specialization.component.html',
  styleUrl: './work-specialization.component.css',
})
export class WorkSpecializationComponent implements OnInit, OnDestroy {
  userSpecializationForm!: FormGroup;
  subscriptions: Subscription[] = [];
  specializations!: Specializations[];
  departments!: Departments[];
  skills: string[] = [];
  loading = false;
  enteredSkills: string[] = [];
  user!: CurrentUser;
  settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });

  constructor(private store: Store, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.specializationForm();
    this.storeSubscription();
    this.initializeEnteredSkills();
    this.disableControls();
  }

  public specializationForm() {
    this.userSpecializationForm = new FormGroup({
      department: new FormControl('', [Validators.required]),
      specialization: new FormControl('', [Validators.required]),
      skills: new FormControl('', [Validators.required]),
    });
  }

  public storeSubscription() {
    const specSub = this.settingsService.getSpecializations().subscribe({
      next: (res: any) => {
        this.specializations = res;
      },
    });

    const departmentSub = this.settingsService.getDepartments().subscribe({
      next: (res: any) => {
        this.departments = res;
      },
    });

    const storeSub = this.store.select(selectCurrentUser).subscribe({
      next: user => {
        if (user) {
          this.user = user;
          this.setValues();
        }
      },
    });

    this.subscriptions.push(storeSub, specSub, departmentSub);
  }

  private disableControls() {
    this.userSpecializationForm.get('department')?.disable();

    this.userSpecializationForm.get('specialization')?.disable();
  }

  private initializeEnteredSkills() {
    const skillsSub = this.settingsService.getUserSkills().subscribe({
      next: res => {
        this.enteredSkills = res.map(skill => skill);
      },
    });

    this.subscriptions.push(skillsSub);
  }

  getSpecializationErrors(): string {
    const control = this.userSpecializationForm.get('specialization');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  getDepartmentErrors(): string {
    const control = this.userSpecializationForm.get('department');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }
    return '';
  }

  setValues() {
    if (this.user && this.user.specializations[0]) {
      this.userSpecializationForm.patchValue({
        department: this.user.department || '',
        specialization: this.user.specializations[0].name || '',
        skills: '',
      });
    }
  }

  get signalValues() {
    const val = this.settingsSig();
    return val;
  }

  addSkill(): void {
    const enteredSkill = this.userSpecializationForm.get('skills')?.value;

    if (enteredSkill) {
      this.enteredSkills.push(enteredSkill);
      this.userSpecializationForm.get('skills')?.reset();
    }
  }

  removeSkill(skill: string): void {
    const index = this.enteredSkills.indexOf(skill);
    if (index !== -1) {
      // Remove skill from the enteredSkills array
      this.enteredSkills.splice(index, 1);

      // Call the deleteSkill service to remove the skill
      this.settingsService.deleteSkill(skill).subscribe({
        next: response => {
          // Handle the response if needed
          console.log(response);
        },
        error: error => {
          // Handle the error if needed
          console.error(error);
        },
      });
    }
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.settingsSig.set({
      success: null,
      error: null,
      pending: true,
    });

    if (!this.user) {
      return;
    }

    const reqBody = {
      userId: this.user.userId,
      department: this.userSpecializationForm.get('department')?.value || '',
      specialization:
        this.userSpecializationForm.get('specialization')?.value || '',
      skills: this.enteredSkills,
    };

    this.settingsService.updateSpecialization(reqBody).subscribe({
      next: response => {
        if (response && response.message) {
          this.settingsSig.set({
            success: response,
            error: null,
            pending: false,
          });
          setTimeout(() => {
            this.settingsSig.set({
              success: null,
              error: null,
              pending: false,
            });
            this.loading = false;
          }, 3000);
        }
      },
      error: error => {
        this.settingsSig.set({
          success: null,
          error: error.errors,
          pending: false,
        });

        setTimeout(() => {
          this.settingsSig.set({
            success: null,
            error: null,
            pending: false,
          });
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
