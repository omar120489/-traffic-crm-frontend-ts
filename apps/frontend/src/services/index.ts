// SDK-based services (new - use these)
export * from './contacts.sdk';
export * from './leads.sdk';
export * from './deals.sdk';
export * from './companies.sdk';

// Legacy services (keep for backward compatibility)
export * as commentsService from './comments';
export * as attachmentsService from './attachments';
export * as notificationsService from './notifications';
export * as pnlService from './pnl';
export * as journeyService from './journey';
export * as reportingService from './reporting';
