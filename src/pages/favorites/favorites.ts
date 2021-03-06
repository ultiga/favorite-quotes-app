import { Component } from '@angular/core';
import { QuotesService } from '../../services/quotes';
import { Quote } from '../../data/quote.interface';
import { ModalController, PopoverController, MenuController, AlertController, ToastController } from 'ionic-angular';
import { QuotePage } from '../quote/quote';
import { SettingsService } from '../../services/settings';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})

export class FavoritesPage {
  quotes: Quote[];
  constructor (
    private quoteService: QuotesService,
    private modalCtrl: ModalController,
    private settingsSvc: SettingsService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController) {
      this.menuCtrl.enable(false, 'menuLogin');
      this.menuCtrl.enable(true, 'menuFav');
    }

  ionViewWillEnter() {
    this.quotes = this.quoteService.getFavoriteQuotes();
  }

  getQuoteDetail(quote: Quote) {
    let modal = this.modalCtrl.create(QuotePage, quote);
    modal.present();
    modal.onDidDismiss((remove: boolean) => {
      if (remove) {
        this.quoteService.removeQuoteFromFavorites(quote);
        this.quotes = this.quoteService.getFavoriteQuotes();
      }
    });
  }

  unfavoriteQuote(quote:Quote) {
    this.quoteService.removeQuoteFromFavorites(quote);
    this.quotes=this.quoteService.getFavoriteQuotes();
  }

  setBgColor() {
    return this.settingsSvc.isAltBackground() ? 'altQuoteBackground' : 'quoteBackground';
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'User was added successfully',
      position: 'top'
    });

    toast.present();
    toast.dismiss();
    toast.onDidDismiss(() => {
      console.log("Toast dismissed.")
    });
  }

  onNewQuote() {
    const alert = this.alertCtrl.create({
      title: "Add New Quote",
      inputs: [
        {
          name: "person",
          placeholder: "Quote Author"
        },
        {
          name: "text",
          placeholder: "Quote"
        }
      ],
      buttons: [
        {
          text: "OK",
          handler: data => {
            let q = {id: "0", person: data.person, text: data.text};
            if (data.person && data.text) {
              this.quoteService.addQuoteToFavorites(q);
              this.quotes = this.quoteService.getFavoriteQuotes();

              const toast = this.toastCtrl.create({
                message: 'New quote was added',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    })
    alert.present();
  }

  showPopover (e) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: e
    });
  }
}
