import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewAgent } from '@models/types/newAgent';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { onlyNumbers } from '@validators/only-numbers';
import * as json from './agent.metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { MatIconModule } from '@angular/material/icon';
import { Agent } from '@models/DTO/agent';
import { filter, merge, tap } from 'rxjs';

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
export class AgentComponent implements OnDestroy {
  constructor() {
    ErrorMessageHandle(this.agentNumber, this.errorAgentNumber, json.errors.agentNumber);
    ErrorMessageHandle(this.name, this.errorName, json.errors.name);
    ErrorMessageHandle(this.lastName, this.errorLastName, json.errors.lastName);
    ErrorMessageHandle(this.email, this.errorEmail, json.errors.email);
    merge(this.name.valueChanges, this.lastName.valueChanges)
      .pipe(
        filter(value => value.trim() !== '')
      ).subscribe(_ => {
        this.generateShortName();
        this.generatUnitedEmail();
      });
  }
  ngOnDestroy(): void {
    this.store.clearAgentId();
  }

  //#region  Properties
  private fb = inject(FormBuilder);
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);

  public form = this.fb.group({
    agentNumber: [this.store.agentSelected()?.agentNumber ?? '', [Validators.required, Validators.minLength(6), onlyNumbers()]],
    shortName: [{ value: this.store.agentSelected()?.shortName ?? '', disabled: true }, [Validators.required, Validators.minLength(2)]],
    name: [this.store.agentSelected()?.name ?? '', [Validators.required, Validators.minLength(2)]],
    lastName: [this.store.agentSelected()?.lastName ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.store.agentSelected()?.email ?? '', [Validators.required, Validators.minLength(2), Validators.email]],
    password: [''],
  });

  public search = new FormControl();

  public errorAgentNumber = signal(json.errors.agentNumber.required);
  public errorName = signal(json.errors.name.required);
  public errorLastName = signal(json.errors.lastName.required);
  public errorEmail = signal(json.errors.email.required);
  //#endregion

  //#region methods
  public async save(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.registerNewAgent(this.agentData);
    this.modalsService.closeModal();
  }

  public async update(): Promise<void> {
    if (this.form.invalid) return;
    const agent: Agent = {
      ...this.agentData,
      id: this.store.agentSelected()?.id!
    }
    await this.store.updateAgent(agent);
    this.modalsService.closeModal();

  }

  private generateShortName(): void {
    this.shortName.setValue(`${this.nameValue.at(0)?.toUpperCase()}.${this.lastNameValue.toLocaleUpperCase()}`);
  }

  private generatUnitedEmail(): void {
    this.email.setValue(`${this.nameValue.toLowerCase()}.${this.lastNameValue.toLowerCase()}@united.com`);
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

  public get agentNumberValue(): string {
    return this.agentNumber.value;
  }
  public get shortNameValue(): string {
    return this.shortName.value;
  }
  public get nameValue(): string {
    return this.name.value;
  }
  public get lastNameValue(): string {
    return this.lastName.value;
  }
  public get emailValue(): string {
    return this.email.value;;
  }
  private get agentData(): NewAgent {
    const agent: NewAgent = {
      agentNumber: this.agentNumberValue,
      shortName: this.shortNameValue,
      name: this.nameValue,
      lastName: this.lastNameValue,
      email: this.emailValue,
      password: ''
    }
    return agent;
  }
  //#endregion

}
