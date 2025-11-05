import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  numeric,
  pgEnum,
  varchar,
  jsonb,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

type Json = Record<string, unknown>;

export const authProviderEnum = pgEnum('auth_provider', [
  'local',
  'google',
  'facebook',
]);

export const accountTypeEnum = pgEnum('account_type', [
  'personal',
  'business',
  'team',
  'savings',
]);

export const currencyEnum = pgEnum('currency_code', [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'AUD',
  'CAD',
  'JPY',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'completed',
  'failed',
  'in_progress',
  'refunded',
  'cancelled',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'subscription',
  'software',
  'transport',
  'food_beverage',
  'storage',
  'income',
  'expense',
  'refund',
  'transfer',
  'other',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
]);

export const paymentScheduleEnum = pgEnum('payment_schedule', [
  'one_time',
  'weekly',
  'bi_weekly',
  'monthly',
  'quarterly',
  'yearly',
  'custom',
]);

export const paymentMethodStatusEnum = pgEnum('payment_method_status', [
  'active',
  'inactive',
  'expired',
  'blocked',
]);

export const cardBrandEnum = pgEnum('card_brand', [
  'visa',
  'mastercard',
  'amex',
  'discover',
  'diners',
  'jcb',
  'rupay',
  'unionpay',
  'other',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    fullName: text('full_name').notNull(),
    avatarUrl: text('avatar_url'),
    password: text('password'),
    provider: authProviderEnum('provider').notNull().default('local'),
    providerId: text('provider_id'),
    emailVerified: boolean('email_verified').default(false).notNull(),
    lastLogin: timestamp('last_login'),
    language: varchar('language', { length: 16 }).notNull().default('en'),
    timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),
    emailNotifications: boolean('email_notifications').default(true).notNull(),
    pushNotifications: boolean('push_notifications').default(true).notNull(),
    marketingUpdates: boolean('marketing_updates').default(false).notNull(),
    securityAlerts: boolean('security_alerts').default(true).notNull(),
    activeSessions: text('active_sessions').array().default([]).notNull(),
    changedPasswordAt: timestamp('changed_password_at'),
    twoFactorEnabledAt: timestamp('two_factor_enabled_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
    metadata: jsonb('metadata').$type<Json>(),
  },
  (table) => ({
    usersEmailIdx: uniqueIndex('users_email_idx').on(table.email),
    usersProviderIdx: index('users_provider_idx').on(table.provider),
  }),
);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 128 }),
    type: accountTypeEnum('type').notNull().default('personal'),
    currency: currencyEnum('currency').notNull().default('USD'),
    profileUrl: text('profile_url'),
    description: text('description'),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
    metadata: jsonb('metadata').$type<Json>(),
  },
  (table) => ({
    accountsUserIdx: index('accounts_user_idx').on(table.userId),
    accountsSlugIdx: uniqueIndex('accounts_slug_idx').on(table.slug),
  }),
);

export const paymentMethods = pgTable(
  'payment_methods',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    label: text('label').notNull(),
    brand: cardBrandEnum('brand').notNull().default('other'),
    maskedNumber: varchar('masked_number', { length: 32 }),
    lastFour: varchar('last_four', { length: 4 }),
    cardToken: text('card_token'),
    expiryMonth: integer('expiry_month'),
    expiryYear: integer('expiry_year'),
    color: varchar('color', { length: 32 }),
    balance: numeric('balance', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    creditLimit: numeric('credit_limit', { precision: 14, scale: 2 }).default(
      '0',
    ),
    currency: currencyEnum('currency').notNull().default('USD'),
    isDefault: boolean('is_default').default(false).notNull(),
    status: paymentMethodStatusEnum('status').notNull().default('active'),
    billingAddress: text('billing_address'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    archivedAt: timestamp('archived_at'),
  },
  (table) => ({
    paymentMethodsUserIdx: index('payment_methods_user_idx').on(table.userId),
    paymentMethodsAccountIdx: index('payment_methods_account_idx').on(
      table.accountId,
    ),
    paymentMethodsDefaultIdx: index('payment_methods_default_idx').on(
      table.userId,
      table.isDefault,
    ),
  }),
);

export const billingAndSubscriptions = pgTable(
  'billing_and_subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    paymentMethodId: uuid('payment_method_id').references(
      () => paymentMethods.id,
      { onDelete: 'set null' },
    ),
    externalSubscriptionId: text('external_subscription_id'),
    plan: text('plan').notNull(),
    planTier: text('plan_tier'),
    status: subscriptionStatusEnum('status').notNull().default('active'),
    currency: currencyEnum('currency').notNull().default('USD'),
    amount: numeric('amount', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    nextBillingDate: timestamp('next_billing_date'),
    trialEndsAt: timestamp('trial_ends_at'),
    paymentMethodSnapshot: jsonb('payment_method_snapshot').$type<Json>(),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    canceledAt: timestamp('canceled_at'),
  },
  (table) => ({
    billingUserIdx: index('billing_user_idx').on(table.userId),
    billingAccountIdx: index('billing_account_idx').on(table.accountId),
  }),
);

export const merchants = pgTable(
  'merchants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    supportEmail: varchar('support_email', { length: 255 }),
    websiteUrl: text('website_url'),
    logoUrl: text('logo_url'),
    category: transactionTypeEnum('category').default('other'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    merchantsNameIdx: index('merchants_name_idx').on(table.name),
  }),
);

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 32 }),
    company: text('company'),
    taxId: varchar('tax_id', { length: 64 }),
    addressLine1: text('address_line_1'),
    addressLine2: text('address_line_2'),
    city: text('city'),
    region: text('region'),
    postalCode: varchar('postal_code', { length: 32 }),
    country: varchar('country', { length: 64 }),
    notes: text('notes'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    clientsUserIdx: index('clients_user_idx').on(table.userId),
    clientsEmailIdx: index('clients_email_idx').on(table.email),
  }),
);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    clientId: uuid('client_id').references(() => clients.id, {
      onDelete: 'set null',
    }),
    number: varchar('number', { length: 128 }).notNull(),
    status: invoiceStatusEnum('status').notNull().default('draft'),
    currency: currencyEnum('currency').notNull().default('USD'),
    issueDate: timestamp('issue_date'),
    dueDate: timestamp('due_date'),
    subtotal: numeric('subtotal', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    taxTotal: numeric('tax_total', { precision: 14, scale: 2 }).default('0'),
    discountTotal: numeric('discount_total', {
      precision: 14,
      scale: 2,
    }).default('0'),
    total: numeric('total', { precision: 14, scale: 2 }).notNull().default('0'),
    notes: text('notes'),
    terms: text('terms'),
    sentAt: timestamp('sent_at'),
    paidAt: timestamp('paid_at'),
    canceledAt: timestamp('canceled_at'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    invoicesNumberIdx: uniqueIndex('invoices_number_idx').on(table.number),
    invoicesUserIdx: index('invoices_user_idx').on(table.userId),
  }),
);

export const invoiceItems = pgTable(
  'invoice_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoices.id, { onDelete: 'cascade' }),
    productName: text('product_name').notNull(),
    description: text('description'),
    quantity: numeric('quantity', { precision: 10, scale: 2 })
      .notNull()
      .default('1'),
    unitPrice: numeric('unit_price', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    discountRate: numeric('discount_rate', { precision: 5, scale: 2 }).default(
      '0',
    ),
    taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).default('0'),
    amount: numeric('amount', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    invoiceItemsInvoiceIdx: index('invoice_items_invoice_idx').on(
      table.invoiceId,
    ),
  }),
);

export const invoicePayments = pgTable(
  'invoice_payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoices.id, { onDelete: 'cascade' }),
    paymentMethodId: uuid('payment_method_id').references(
      () => paymentMethods.id,
      { onDelete: 'set null' },
    ),
    amount: numeric('amount', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    currency: currencyEnum('currency').notNull().default('USD'),
    paidAt: timestamp('paid_at').defaultNow().notNull(),
    referenceId: varchar('reference_id', { length: 128 }),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    invoicePaymentsInvoiceIdx: index('invoice_payments_invoice_idx').on(
      table.invoiceId,
    ),
  }),
);

export const scheduledPayments = pgTable(
  'scheduled_payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    paymentMethodId: uuid('payment_method_id').references(
      () => paymentMethods.id,
      { onDelete: 'set null' },
    ),
    merchantId: uuid('merchant_id').references(() => merchants.id, {
      onDelete: 'set null',
    }),
    payeeName: text('payee_name').notNull(),
    payeeEmail: varchar('payee_email', { length: 255 }),
    payeeAvatarUrl: text('payee_avatar_url'),
    amount: numeric('amount', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    currency: currencyEnum('currency').notNull().default('USD'),
    frequency: paymentScheduleEnum('frequency').notNull().default('monthly'),
    isRecurring: boolean('is_recurring').default(true).notNull(),
    isAutoPayEnabled: boolean('is_auto_pay_enabled').default(false).notNull(),
    lastPaymentAt: timestamp('last_payment_at'),
    nextPaymentAt: timestamp('next_payment_at'),
    notes: text('notes'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    canceledAt: timestamp('canceled_at'),
  },
  (table) => ({
    scheduledPaymentsUserIdx: index('scheduled_payments_user_idx').on(
      table.userId,
    ),
    scheduledPaymentsNextIdx: index('scheduled_payments_next_idx').on(
      table.nextPaymentAt,
    ),
  }),
);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accounts.id, {
      onDelete: 'set null',
    }),
    paymentMethodId: uuid('payment_method_id').references(
      () => paymentMethods.id,
      { onDelete: 'set null' },
    ),
    merchantId: uuid('merchant_id').references(() => merchants.id, {
      onDelete: 'set null',
    }),
    invoiceId: uuid('invoice_id').references(() => invoices.id, {
      onDelete: 'set null',
    }),
    scheduledPaymentId: uuid('scheduled_payment_id').references(
      () => scheduledPayments.id,
      { onDelete: 'set null' },
    ),
    referenceId: varchar('reference_id', { length: 128 }),
    type: transactionTypeEnum('type').notNull().default('other'),
    status: transactionStatusEnum('status').notNull().default('completed'),
    amount: numeric('amount', { precision: 14, scale: 2 })
      .notNull()
      .default('0'),
    feeAmount: numeric('fee_amount', { precision: 14, scale: 2 }).default('0'),
    currency: currencyEnum('currency').notNull().default('USD'),
    occurredAt: timestamp('occurred_at').defaultNow().notNull(),
    settledAt: timestamp('settled_at'),
    description: text('description'),
    notes: text('notes'),
    receiptUrl: text('receipt_url'),
    metadata: jsonb('metadata').$type<Json>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    transactionsUserIdx: index('transactions_user_idx').on(table.userId),
    transactionsAccountIdx: index('transactions_account_idx').on(
      table.accountId,
    ),
    transactionsTypeIdx: index('transactions_type_idx').on(table.type),
    transactionsStatusIdx: index('transactions_status_idx').on(table.status),
    transactionsReferenceIdx: uniqueIndex('transactions_reference_idx').on(
      table.referenceId,
    ),
  }),
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
    revokedAt: timestamp('revoked_at'),
    metadata: jsonb('metadata').$type<Json>(),
  },
  (table) => ({
    sessionsUserIdx: index('sessions_user_idx').on(table.userId),
    sessionsTokenIdx: uniqueIndex('sessions_token_idx').on(table.token),
  }),
);

export const paymentMethod = paymentMethods;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type PaymentMethod = InferSelectModel<typeof paymentMethods>;
export type NewPaymentMethod = InferInsertModel<typeof paymentMethods>;
export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
export type Invoice = InferSelectModel<typeof invoices>;
export type NewInvoice = InferInsertModel<typeof invoices>;
