import { DronesymFrontendPage } from './app.po';

describe('dronesym-frontend App', () => {
  let page: DronesymFrontendPage;

  beforeEach(() => {
    page = new DronesymFrontendPage();
  });

  // FIXME: This test is redundant, we should delete it
  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
