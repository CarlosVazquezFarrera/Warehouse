import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { AdminDashBoardStore } from '@store/admin.store';
import * as json from './admin-agent.metadata.json';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { AgentPasswordInfo } from '@models/types/agentPasswordInfo';
import { AgentService } from '@services/agent.service';
import { ModalsService } from '@services/modals.service';
import { MessageService } from '@services/message.service';

@Component({
  selector: 'app-admin-agent',
  standalone: true,
  imports: [ModalHeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-agent.component.html',
  styleUrl: './admin-agent.component.scss'
})
export class AdminAgentComponent implements OnDestroy {
  constructor() {
    ErrorMessageHandle(this.password, this.errorsPassword, json.errors.password);
  }

  public store = inject(AdminDashBoardStore);
  private agentService = inject(AgentService);
  private modalService = inject(ModalsService);
  private messajeService = inject(MessageService);

  public password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).*$/)]);
  public hide = signal(true);
  public errorsPassword = signal(json.errors.password.required);
  
  ngOnDestroy(): void {
    this.store.agentUnSelected();
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  async setPassword(): Promise<void> {
    if (this.password.invalid) return;

    const passwordInfo: AgentPasswordInfo = {
      id: this.store.agent().id,
      password: this.password.value!
    }

    const response = await this.messajeService.confirmationMessage("Are you sure you want to cotinue?");
    if(!response) return;

    const result = await this.agentService.setPassword(passwordInfo);
    if (!result) return;

    this.modalService.closeModal();
  }
}