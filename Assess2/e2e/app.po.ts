export class AssessPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('assess-app h1')).getText();
  }
}
