import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ModalsService } from '@services/modals.service';
import { SessionService } from '@services/session.service';
import { catchError, finalize, throwError } from 'rxjs';

let activePetitions: number = 0;
let lodingDisplayed: boolean = false;
let anyError: boolean = false;


export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let sessionService = inject(SessionService);
  let modalsService = inject(ModalsService);


  if (!lodingDisplayed) {
    modalsService.open('loading', 'center', {})
    lodingDisplayed = true;
  }
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  if (sessionService.isLoggedIn) {
    headers = headers.append('Authorization', `Bearer ${sessionService.token}`);
  }

  const clonReq = req.clone({
    headers
  });

  activePetitions++;
  return next(clonReq).pipe(
    finalize(() => {
      activePetitions--;
      if (activePetitions == 0) {
        modalsService.close();
        lodingDisplayed = false;
        anyError = false;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (!anyError) {
        if (error.status === 0) {
          anyError = true;
          modalsService.openDialog('information', 'Server error. Contact support')
        }
        else {
          if (error.error.status === 460) {
            anyError = true;
            modalsService.openDialog('information', 'Check your credentials', 'Something went wrong')
          }
        }
      }
      return throwError(() => new Error(error.message));
    })
  );
};
