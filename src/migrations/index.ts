import * as migration_20261106_174758_initial from './20261106_174758_initial.ts';
import * as migration_20261106_215849_email_verification from './20261106_215849_email_verification.ts';
import * as migration_20261109_212941_products_bookings from './20261109_212941_products_bookings.ts';

export const migrations = [
  {
    up: migration_20261106_174758_initial.up,
    down: migration_20261106_174758_initial.down,
    name: '20261106_174758_initial',
  },
  {
    up: migration_20261106_215849_email_verification.up,
    down: migration_20261106_215849_email_verification.down,
    name: '20261106_215849_email_verification',
  },
  {
    up: migration_20261109_212941_products_bookings.up,
    down: migration_20261109_212941_products_bookings.down,
    name: '20261109_212941_products_bookings'
  },
];
