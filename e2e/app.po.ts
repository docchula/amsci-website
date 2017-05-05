import { browser, element, by } from 'protractor';

export class AnandayquizPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('adq-root h1')).getText();
  }
}
