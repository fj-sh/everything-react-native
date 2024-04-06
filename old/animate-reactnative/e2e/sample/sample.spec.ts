import { by, device, element, expect } from 'detox';

describe('sample-test-id が開かれる', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('should display sign up form', async () => {
    await expect(element(by.id('sample-test-id'))).toBeVisible();
  });
});
