import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
  beds: integer('beds').notNull(),
  baths: numeric('baths', { precision: 3, scale: 1 }).notNull(),
  sqft: integer('sqft').notNull(),
  ownerName: text('owner_name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
