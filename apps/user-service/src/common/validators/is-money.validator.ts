import { Matches } from 'class-validator';

export function IsMoney() {
  return Matches(/^(0|[1-9]\d{0,9})(\.\d{1,2})?$/, {
    message: 'Invalid money format',
  });
}
