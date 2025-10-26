import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { LeadsModule } from './modules/leads/leads.module';
import { DealsModule } from './modules/deals/deals.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';
import { StagesModule } from './modules/stages/stages.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { TagsModule } from './modules/tags/tags.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SavedViewsModule } from './modules/saved-views.module';
import jwtConfig from './auth/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    HealthModule,
    AuthModule,
    PrismaModule,
    ContactsModule,
    CompaniesModule,
    LeadsModule,
    DealsModule,
    PipelinesModule,
    StagesModule,
    ActivitiesModule,
    TagsModule,
    AnalyticsModule,
    SavedViewsModule,
  ]
})
export class AppModule {}

