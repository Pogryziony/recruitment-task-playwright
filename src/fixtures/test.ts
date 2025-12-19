import { test as base, expect } from '@playwright/test';
import { uniqueUser, type RegisteredUser } from '../utils/data';

type Fixtures = {
  user: RegisteredUser;
};

export const test = base.extend<Fixtures>({
  user: async ({}, use) => {
    await use(uniqueUser('pw'));
  },
});

export { expect };
