import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NewAgent } from '@models/types/newAgent';
import { onlyNumbers } from '@validators/only-numbers';
import * as json from './agent.metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { DashboardStore } from '@store/dashboard.store';
import { ModalsService } from '@services/modals.service';
import { Agent } from '@models/DTO/agent';
import { filter, merge, tap } from 'rxjs';
import { passwordComplexityValidator } from '@validators/password';
import { FormModule } from '@shared/modules/form.module';
import { MaterialModule } from '@shared/modules/material.module';
import { CapitalizeFirstDirective } from '@shared/directives/capitalize-first.directive';
import { removeSpaces } from '@shared/helper/string';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    FormModule,
    MaterialModule,
    CapitalizeFirstDirective,
  ]
  ,
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent implements OnDestroy, OnInit {
  constructor() {
    ErrorMessageHandle(this.name, this.errorName, json.errors.name);
    ErrorMessageHandle(this.lastName, this.errorLastName, json.errors.lastName);
    ErrorMessageHandle(this.agentNumber, this.errorAgentNumber, json.errors.agentNumber);
    ErrorMessageHandle(this.email, this.errorEmail, json.errors.email);
    ErrorMessageHandle(this.passWord, this.errorPassword, json.errors.password);
    ErrorMessageHandle(this.airportId, this.errorAirportId, json.errors.airportId);

    merge(this.name.valueChanges, this.lastName.valueChanges)
      .pipe(
        filter(() => this.name.valid && this.lastName.valid)
      ).subscribe(_ => {
        this.generateShortName();
        this.generatUnitedEmail();
      });
  }
  ngOnInit(): void {
    if (this.store.agentSelected()?.id){
      this.passWord.clearValidators();
      this.passWord.disable();
    }
    this.store.getAiports();
  }
  ngOnDestroy(): void {
    this.store.clearAgentId();
  }

  //#region  Properties
  public hide = signal(true);
  private fb = inject(FormBuilder);
  public store = inject(DashboardStore);
  private modalsService = inject(ModalsService);

  public form = this.fb.group({
    name: [this.store.agentSelected()?.name ?? '', [Validators.required, Validators.minLength(2)]],
    lastName: [this.store.agentSelected()?.lastName ?? '', [Validators.required, Validators.minLength(2)]],
    agentNumber: [this.store.agentSelected()?.agentNumber ?? '', [Validators.required, Validators.minLength(6), onlyNumbers()]],
    shortName: [{ value: this.store.agentSelected()?.shortName ?? '', disabled: true }, [Validators.required, Validators.minLength(2)]],
    email: [this.store.agentSelected()?.email ?? '', [Validators.required, Validators.minLength(2), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5), passwordComplexityValidator()]],
    airportId: [this.store.agentSelected()?.airportId ?? '', Validators.required]
  });

  public errorName = signal(json.errors.name.required);
  public errorLastName = signal(json.errors.lastName.required);
  public errorAgentNumber = signal(json.errors.agentNumber.required);
  public errorEmail = signal(json.errors.email.required);
  public errorPassword = signal(json.errors.password.required);
  public errorAirportId = signal(json.errors.airportId.required);
  //#endregion

  //#region methods
  public clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
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
    this.shortName.setValue(`${removeSpaces(this.nameValue.at(0)!).toUpperCase()}.${removeSpaces(this.lastNameValue).toLocaleUpperCase()}`);
  }

  private generatUnitedEmail(): void {
    this.email.setValue(`${removeSpaces(this.nameValue).toLowerCase()}.${removeSpaces(this.lastNameValue.trim().toLowerCase())}@united.com`);
  }
  private control(name: string): AbstractControl {
    return this.form.get(name)!;
  }
  //#endregion

  //#region gets
  private get agentNumber(): AbstractControl {
    return this.control('agentNumber')!;
  }
  private get shortName(): AbstractControl {
    return this.control('shortName')!;
  }
  private get name(): AbstractControl {
    return this.control('name')!;
  }
  private get lastName(): AbstractControl {
    return this.control('lastName')!;
  }
  private get email(): AbstractControl {
    return this.control('email')!;
  }
  private get agentNumberValue(): string {
    return this.agentNumber.value;
  }
  private get shortNameValue(): string {
    return this.shortName.value;
  }
  private get nameValue(): string {
    return this.name.value;
  }
  private get lastNameValue(): string {
    return this.lastName.value;
  }
  private get emailValue(): string {
    return this.email.value;
  }
  private get passWord(): AbstractControl {
    return this.control('password');
  }
  private get airportId(): AbstractControl {
    return this.control('airportId');
  }
  private get agentData(): NewAgent {
    const agent: NewAgent = {
      agentNumber: this.agentNumberValue,
      shortName: this.shortNameValue,
      name: this.nameValue,
      lastName: this.lastNameValue,
      email: this.emailValue,
      password: this.passWord.value,
      airportId: this.airportId.value,
      isActive: true
    }
    return agent;
  }
  //#endregion

}
