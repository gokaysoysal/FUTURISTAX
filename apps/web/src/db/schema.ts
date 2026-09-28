import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

/**
 * Lead kalıcılığı.
 *
 * E-posta tek başına kayıt katmanı değildir: gelen kutusu silinebilir,
 * filtrelenebilir, aranamaz. Her talep önce veritabanına yazılır, sonra
 * bildirim gönderilir. Böylece e-posta servisi çökse bile talep kaybolmaz.
 */

export const leadStatus = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'converted',
  'archived',
  'spam',
]);

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: varchar('name', { length: 120 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    company: varchar('company', { length: 160 }),
    topic: varchar('topic', { length: 64 }).notNull(),
    message: text('message').notNull(),

    status: leadStatus('status').notNull().default('new'),

    /**
     * KVKK kanıt zinciri. Rızanın alındığı an, hangi metin sürümüne karşı
     * verildiği ve kaynak IP saklanır — denetimde ibraz edilebilir olmalı.
     */
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
    consentPolicyVersion: varchar('consent_policy_version', { length: 20 }).notNull(),

    sourceIp: varchar('source_ip', { length: 64 }),
    userAgent: text('user_agent'),
    /** utm_source, referrer vb. — dönüşüm analizi için */
    attribution: jsonb('attribution').$type<Record<string, string>>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index('leads_created_at_idx').on(table.createdAt),
    statusIdx: index('leads_status_idx').on(table.status),
    emailIdx: index('leads_email_idx').on(table.email),
  }),
);

/**
 * Erişim günlüğü — kişisel veriye kimin ne zaman eriştiği.
 * KVKK veri güvenliği yükümlülüğü kapsamında tutulur.
 */
export const leadAccessLog = pgTable('lead_access_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id')
    .notNull()
    .references(() => leads.id, { onDelete: 'cascade' }),
  actor: varchar('actor', { length: 160 }).notNull(),
  action: varchar('action', { length: 40 }).notNull(),
  at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
