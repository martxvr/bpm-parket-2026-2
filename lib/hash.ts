import 'server-only';
import { createHash } from 'node:crypto';

const SALT = process.env.HASH_SALT || 'bpm-parket-salt-change-in-production';

export function hashIdentifier(value: string): string {
  return createHash('sha256').update(`${SALT}:${value}`).digest('hex').slice(0, 32);
}
