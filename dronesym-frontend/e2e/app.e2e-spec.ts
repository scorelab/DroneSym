import { DronesymFrontendPage } from './app.po';

describe('dronesym-frontend App', () => {
  let page: DronesymFrontendPage;

  beforeEach(() => {
    page = new DronesymFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
