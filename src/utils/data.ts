export type RegisteredUser = {
  username: string;
  email: string;
  password: string;
};

export function validateUser(user: RegisteredUser): void {
  if (!user || typeof user !== 'object') {
    throw new Error('Expected user to be an object');
  }

  const { username, email, password } = user;

  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Expected user.username to be a non-empty string');
  }

  if (typeof email !== 'string' || email.trim().length === 0 || !email.includes('@')) {
    throw new Error('Expected user.email to be a valid email string');
  }

  if (typeof password !== 'string' || password.length < 4 || password.length > 20) {
    throw new Error('Expected user.password length to be between 4 and 20 characters');
  }
}

export function uniqueUser(seed: string = 'e2e'): RegisteredUser {
  const nonce = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const username = `${seed}_${nonce}`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24);
  const email = `${seed}.${nonce}@example.test`.toLowerCase();

  // Site validation: password must be between 4 and 20 characters.
  // Keep it deterministic in length to avoid rare client-side validation edge cases.
  const password = `Pw!${Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, '0')}`; // 12 chars

  return { username, email, password };
}
