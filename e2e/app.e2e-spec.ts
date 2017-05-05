import { AnandayquizPage } from './app.po';

describe('anandayquiz App', () => {
  let page: AnandayquizPage;

  beforeEach(() => {
    page = new AnandayquizPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('adq works!');
  });
});
