import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create org
  const org = await prisma.org.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'Acme Inc.',
      plan: 'pro',
      status: 'active',
    },
  });
  console.log('✅ Org:', org.name);

  // 2. Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme.io' },
    update: {},
    create: {
      email: 'admin@acme.io',
      name: 'Admin User',
      Org: { connect: { id: org.id } },
      role: 'admin',
      status: 'active',
    },
  });
  console.log('✅ User:', admin.email);

  // 3. Create sales pipeline with stages
  const pipeline = await prisma.pipeline.create({
    data: {
      Org: { connect: { id: org.id } },
      name: 'Sales Pipeline',
      isDefault: true,
    },
  });

  const [prospecting] = await Promise.all([
    prisma.stage.create({
      data: {
        Org: { connect: { id: org.id } },
        Pipeline: { connect: { id: pipeline.id } },
        name: 'Prospecting',
        order: 1,
        probability: 10,
      },
    }),
    prisma.stage.create({
      data: {
        Org: { connect: { id: org.id } },
        Pipeline: { connect: { id: pipeline.id } },
        name: 'Proposal',
        order: 2,
        probability: 40,
      },
    }),
    prisma.stage.create({
      data: {
        Org: { connect: { id: org.id } },
        Pipeline: { connect: { id: pipeline.id } },
        name: 'Negotiation',
        order: 3,
        probability: 70,
      },
    }),
    prisma.stage.create({
      data: {
        Org: { connect: { id: org.id } },
        Pipeline: { connect: { id: pipeline.id } },
        name: 'Closed Won',
        order: 4,
        probability: 100,
      },
    }),
  ]);
  console.log('✅ Pipeline:', pipeline.name, 'with', 4, 'stages');

  // 4. Create lead source
  const webSource = await prisma.leadSource.create({
    data: {
      Org: { connect: { id: org.id } },
      name: 'Website Form',
      type: 'web',
    },
  });
  console.log('✅ Lead Source:', webSource.name);

  // 5. Create company
  const company = await prisma.company.create({
    data: {
      Org: { connect: { id: org.id } },
      name: 'Globex Corporation',
      domain: 'globex.com',
      size: '51-200',
      industry: 'Technology',
      website: 'https://globex.com',
    },
  });
  console.log('✅ Company:', company.name);

  // 6. Create contact
  const contact = await prisma.contact.create({
    data: {
      Org: { connect: { id: org.id } },
      name: 'Hannah Lee',
      email: 'hannah@globex.com',
      phone: '+1-555-0123',
      title: 'VP of Sales',
      Company: { connect: { id: company.id } },
      User: { connect: { id: admin.id } },
      source: 'web',
    },
  });
  console.log('✅ Contact:', contact.name);

  // 7. Create lead
  const lead = await prisma.lead.create({
    data: {
      Org: { connect: { id: org.id } },
      Contact: { connect: { id: contact.id } },
      LeadSource: { connect: { id: webSource.id } },
      status: 'qualified',
      score: 85,
      User: { connect: { id: admin.id } },
      notes: 'High-value prospect, interested in enterprise plan',
    },
  });
  console.log('✅ Lead:', lead.id, '(score:', lead.score + ')');

  // 8. Create deal
  const deal = await prisma.deal.create({
    data: {
      Org: { connect: { id: org.id } },
      title: 'Globex Annual Subscription',
      amountCents: 1200000, // $12,000
      currency: 'USD',
      Stage: { connect: { id: prospecting.id } },
      User: { connect: { id: admin.id } },
      Contact: { connect: { id: contact.id } },
      Company: { connect: { id: company.id } },
      status: 'open',
    },
  });
  console.log('✅ Deal:', deal.title, '($' + (deal.amountCents ?? 0) / 100 + ')');

  // 9. Create activity
  await prisma.activity.create({
    data: {
      Org: { connect: { id: org.id } },
      type: 'note',
      entityType: 'deal',
      entityId: deal.id,
      User: { connect: { id: admin.id } },
      subject: 'Initial contact',
      body: 'Had a great intro call. They are very interested in our enterprise features.',
    },
  });
  console.log('✅ Activity created');

  // 10. Create tags
  const hotTag = await prisma.tag.create({
    data: {
      Org: { connect: { id: org.id } },
      name: 'Hot Lead',
      color: '#f44336',
    },
  });

  await prisma.tagAssignment.create({
    data: {
      Org: { connect: { id: org.id } },
      Tag: { connect: { id: hotTag.id } },
      entityType: 'contact',
      entityId: contact.id,
    },
  });
  console.log('✅ Tag:', hotTag.name);

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
