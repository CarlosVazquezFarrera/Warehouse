import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@services/loading.service';
import { MessageService } from '@services/message.service';
import { catchError, finalize, throwError } from 'rxjs';

let activePetitions: number = 0;
let  lodingDisplayed: boolean = false;
let anyError: boolean = false;

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let loadingService = inject(LoadingService);
  let messageService = inject(MessageService);


  if (!lodingDisplayed){
    loadingService.showLoadingScreen();
    lodingDisplayed = true;
  }
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    }
  });

  activePetitions++;
  return next(authReq).pipe(
    finalize(()=>{
      activePetitions--;
      if (activePetitions == 0) {
        loadingService.closeModal();
        lodingDisplayed = false;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        anyError = true;
        messageService.showMessage('Error con el servidor. Llame al soporte');
      }
      else if (error.status === 404) {
        anyError = true;
        messageService.showMessage('Recurso no encontrado', 'Ha ocurrido algo');
      }
      return throwError(() => new Error(error.message));
    })
  );
};
