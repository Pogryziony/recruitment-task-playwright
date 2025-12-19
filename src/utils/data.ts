export type RegisteredUser = {
  username: string;
  email: string;
  password: string;
};

export function uniqueUser(seed: string = 'e2e'): RegisteredUser {
  const nonce = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const username = `${seed}_${nonce}`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24);
  const email = `${seed}.${nonce}@example.test`.toLowerCase();
  // Site validation: password must be between 4 and 20 characters.
  const password = `Pw!${nonce}`.replace(/[^a-zA-Z0-9!]/g, '').slice(0, 20);

  return { username, email, password };
}
