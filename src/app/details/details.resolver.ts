import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

// Constants
import APLICATION from '../constants/app-contants';

// Model
import { PwaFeatureModel } from '../entities/pwa-feature-model';

@Injectable()
export class DetailsPageResolver implements Resolve<any> {
  constructor(private http: HttpClient, private storage: Storage) {}

  resolve(route: ActivatedRouteSnapshot) {
    let slug = route.params['slug'];

    return new Promise((resolve, reject) => {
      this.storage.get('pwa_features').then((pwa_features: Array<PwaFeatureModel>) => {
        if (!pwa_features) {
          this.http.get(APLICATION.DATA_PATH).subscribe(
            (res: Array<PwaFeatureModel>) => {
              this.storage.set('pwa_features', res);
              return resolve(pwa_features.find(item => item.slug == slug));
            },
            error => console.log('oops', error)
          );
        } else {
          return resolve(pwa_features.find(item => item.slug == slug));
        }
      });
    });
  }
}
