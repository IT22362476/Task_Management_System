// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Import from the library
import {
  SocialLoginModule,
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';

import { authInterceptor } from './app/core/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // 🔹 Router
    provideRouter(routes),

    // 🔹 Http + interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 🔹 SocialAuth configuration (uses SocialLoginModule.initialize for Angular 16 compat)
    importProvidersFrom(
      SocialLoginModule.initialize({
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '709410394647-krce6dqhhtd2mttp6fvo6plfnl5ubh8d.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err: any) => {
          console.error('Social auth error:', err);
        }
      })
    )
  ]
}).catch(err => console.error(err));