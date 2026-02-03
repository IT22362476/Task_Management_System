// main.ts - WORKING SOLUTION
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Import from the library
import {
  SocialLoginModule,
  GoogleLoginProvider,
  SOCIAL_AUTH_CONFIG
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

    // 🔹 Import SocialLoginModule providers (optional, but good to include)
    importProvidersFrom(SocialLoginModule),

    // 🔹 SocialAuth configuration - USE THE CORRECT TOKEN!
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
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
      }
    }
  ]
}).catch(err => console.error(err));