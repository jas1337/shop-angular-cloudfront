import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);

    this.authenticateUser();
  }

  authenticateUser() {
    if (!this.endpointEnabled('auth')) {
      console.warn(
        'Endpoint "auth" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }
    const url = this.getUrl('auth', 'authenticate');

    return this.http.get<string>(url).subscribe((token) => {
      localStorage.setItem('authorization_token', token);
    });
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl('import', 'import');

    const authorizationToken = localStorage.getItem('authorization_token');

    if (!authorizationToken) {
      throw new Error('User unauthorized');
    }

    return this.http.get<string>(url, {
      headers: {
        Authorization: `Basic ${authorizationToken}`,
      },
      params: {
        name: fileName,
      },
    });
  }
}
