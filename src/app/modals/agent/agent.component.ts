import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewAgent } from '@models/types/newAgent';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { onlyNumbers } from '@validators/only-numbers';
import * as json from './agent.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    ModalHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent {
  constructor() {
    ErrorMessageHandle(this.agentNumber, this.errorAgentNumber, json.errors.agentNumber);
    ErrorMessageHandle(this.shortName, this.errorShortName, json.errors.shortName);
    ErrorMessageHandle(this.name, this.errorName, json.errors.name);
    ErrorMessageHandle(this.lastName, this.errorLastName, json.errors.lastName);
    ErrorMessageHandle(this.email, this.errorEmail, json.errors.email);
  }

  //#region  Properties
  private fb = inject(FormBuilder);
  private store = inject(DashboardStore);
  private modalsService = inject(ModalsService);

  public form = this.fb.group({
    agentNumber: ['', [Validators.required, Validators.minLength(6), onlyNumbers()]],
    shortName: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.minLength(2), Validators.email]],
    password: [''],
  });

  public search = new FormControl();

  public errorAgentNumber = signal(json.errors.agentNumber.required);
  public errorShortName = signal(json.errors.shortName.required);
  public errorName = signal(json.errors.name.required);
  public errorLastName = signal(json.errors.lastName.required);
  public errorEmail = signal(json.errors.email.required);
  //#endregion

  //#region methods
  public async save(): Promise<void> {
    if (this.form.invalid) return;
    const agent: NewAgent = {
      agentNumber: this.agentNumber.value,
      shortName: this.shortName.value,
      name: this.name.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: ''
    }
    await this.store.registerNewAgent(agent);
    this.modalsService.closeModal();
  }
  //#endregion

  //#region gets
  public get agentNumber(): AbstractControl {
    return this.form.get('agentNumber')!;
  }
  public get shortName(): AbstractControl {
    return this.form.get('shortName')!;
  }
  public get name(): AbstractControl {
    return this.form.get('name')!;
  }
  public get lastName(): AbstractControl {
    return this.form.get('lastName')!;
  }
  public get email(): AbstractControl {
    return this.form.get('email')!;
  }

  //#endregion

}
