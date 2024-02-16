import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { selectCurrentUser } from '@app/auth/store/authorization/AuthReducers';
import {
  CurrentUser,
  Departments,
  InitialSig,
  Specializations,
  Skills,
} from '@app/shared/types/types';
import { AuthActions } from '@app/auth/store/authorization/AuthActions';
import { AccesstokenService } from '@app/shared/services/accesstoken.service';
import { StarRatingComponent } from '@app/shared/components/star-rating/star-rating.component';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-work-specialization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './work-specialization.component.html',
  styleUrl: './work-specialization.component.css',
})
export class WorkSpecializationComponent implements OnInit, OnDestroy {
  public userSpecializationForm: FormGroup = new FormGroup({
    department: new FormControl('', [Validators.required]),
    specialization: new FormControl('', [Validators.required]),
    skill: new FormControl('', [Validators.required]),
    rating: new FormControl(''),
  });

  private subscriptions: Subscription[] = [];

  public specializations!: Specializations[];

  public departments!: Departments[];

  public skills: { name: string; rating: number }[] = [];

  public loading = false;

  public enteredSkills: typeof this.user.skills = [];

  public user!: CurrentUser;

  public settingsSig = signal<InitialSig>({
    success: null,
    error: null,
    pending: false,
  });

  constructor(
    private store: Store,
    private settingsService: SettingsService,
    private tokenService: AccesstokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeSubscription();
    this.initializeEnteredSkills();
    this.disableControls();
  }

  public storeSubscription() {
    const specSub = this.settingsService.getSpecializations().subscribe({
      next: res => {
        this.specializations = res;
      },
    });

    const departmentSub = this.settingsService.getDepartments().subscribe({
      next: res => {
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
    this.enteredSkills = [...this.user.skills];
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

  public refetchSkills() {
    this.tokenService.set(this.router.url, 'lastRoute');
    this.store.dispatch(AuthActions.fetchCurrentUser());
    this.initializeEnteredSkills();
    this.userSpecializationForm.get('skill')?.reset();
  }

  get signalValues() {
    const val = this.settingsSig();
    return val;
  }

  addSkill(): void {
    const enteredSkill = this.userSpecializationForm.get('skills')?.value;
    const rating = this.userSpecializationForm.get('rating')?.value || 0;
    if (enteredSkill) {
      this.skills.push({ name: enteredSkill, rating });
      this.userSpecializationForm.get('skills')?.reset();
    }
  }

  onRatingChange(rating: number) {
    this.userSpecializationForm.patchValue({ rating });
  }

  getStars(rating: number) {
    return Array(rating).fill(null);
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
      refId: this.user.refId,
      department: this.userSpecializationForm.get('department')?.value || '',
      specialization:
        this.userSpecializationForm.get('specialization')?.value || '',
      skills: [this.userSpecializationForm.get('skill')?.value] || [],
      rating: [this.userSpecializationForm.get('rating')?.value] || '',
    };

    this.settingsService.updateSpecialization(reqBody).subscribe({
      next: () => {
        this.refetchSkills();
        const successMessage = 'Skill added successfully';
        this.settingsSig.set({
          success: { message: successMessage },
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
      },
      error: error => {
        this.refetchSkills();
        error;
        this.settingsSig.set({
          success: null,
          error: { message: 'Failed to add skill. Please try again later.' },
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

  removeSkill(skill: { name: Skills; id: number }): void {
    this.settingsService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.refetchSkills();
        const successMessage = 'Skill deleted successfully';
        this.settingsSig.set({
          success: { message: successMessage },
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
      },
      error: () => {
        this.refetchSkills();
        this.settingsSig.set({
          success: null,
          error: { message: 'Failed to delete skill. Please try again later.' },
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
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
