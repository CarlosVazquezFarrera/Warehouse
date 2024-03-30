import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@services/loading.service';
import { catchError, finalize, throwError } from 'rxjs';

let activePetitions: number = 0;
let  lodingDisplayed: boolean = false;
let anyError: boolean = false;

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let loadingService = inject(LoadingService);

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
        loadingService.hideLoadingScreen();
        lodingDisplayed = false;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 200) {
        anyError = true;
        console.log("Error")
      }
      return throwError(() => new Error(error.message));
    })
  );
};
