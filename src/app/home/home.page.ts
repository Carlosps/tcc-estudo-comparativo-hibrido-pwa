import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';

// Constants
import APLICATION from '../constants/app-contants';

// Model
import { PwaFeatureModel } from '../entities/pwa-feature-model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  deferredPrompt: any;
  showInstallBtn: boolean = true;
  pwa_features: Array<PwaFeatureModel> = [];

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {
    window.addEventListener('beforeinstallprompt', e => {
      console.log('beforeinstallprompt Event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      this.showInstallBtn = true;
    });
  }
  ngOnInit() {
    this.storage.get('pwa_features').then(pwa_features => {
      if (!pwa_features) {
        this.http.get(APLICATION.DATA_PATH).subscribe(
          (res: Array<PwaFeatureModel>) => {
            this.pwa_features = res;
            this.storage.set('pwa_features', res);
          },
          error => console.log('oops', error)
        );
      } else {
        this.pwa_features = pwa_features;
      }
    });

    if (this.deferredPrompt === undefined) {
      this.showInstallBtn = false;
    }
  }

  showInstallBanner() {
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // We no longer need the prompt.  Clear it up.
        this.deferredPrompt = null;
      });
    }
  }

  goToDetailsView(item) {
    this.router.navigate(['/details', item.slug]);
  }
}
