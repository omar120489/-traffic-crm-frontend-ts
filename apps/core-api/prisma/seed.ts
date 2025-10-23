import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// org claim your JWT will use in dev
const ORG_ID = process.env.SEED_ORG_ID ?? 'demo-org';

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.org.upsert({
    where: { id: ORG_ID },
    update: {},
    create: { id: ORG_ID, name: 'Demo Org' },
  });
  console.log(`✅ Org: ${org.name} (${org.id})`);

  const acme = await prisma.company.upsert({
    where: { id: 'cmp-acme' },
    update: {},
    create: {
      id: 'cmp-acme',
      orgId: org.id,
      name: 'Acme Inc.',
      website: 'https://acme.com',
      industry: 'Technology',
    },
  });
  console.log(`✅ Company: ${acme.name}`);

  const john = await prisma.contact.upsert({
    where: { id: 'ct-john' },
    update: {},
    create: {
      id: 'ct-john',
      orgId: org.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phone: '+1-555-0100',
      companyId: acme.id,
    },
  });
  console.log(`✅ Contact: ${john.firstName} ${john.lastName} (${john.email})`);

  const jane = await prisma.contact.upsert({
    where: { id: 'ct-jane' },
    update: {},
    create: {
      id: 'ct-jane',
      orgId: org.id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@acme.com',
      phone: '+1-555-0101',
      companyId: acme.id,
    },
  });
  console.log(`✅ Contact: ${jane.firstName} ${jane.lastName} (${jane.email})`);

  const lead1 = await prisma.lead.upsert({
    where: { id: 'ld-001' },
    update: {},
    create: {
      id: 'ld-001',
      orgId: org.id,
      title: 'Website Inquiry',
      contactId: john.id,
      status: 'NEW',
      source: 'website',
      score: 75,
    },
  });
  console.log(`✅ Lead: ${lead1.title} (${lead1.status})`);

  const lead2 = await prisma.lead.upsert({
    where: { id: 'ld-002' },
    update: {},
    create: {
      id: 'ld-002',
      orgId: org.id,
      title: 'Referral from Partner',
      contactId: jane.id,
      status: 'QUALIFIED',
      source: 'referral',
      score: 85,
    },
  });
  console.log(`✅ Lead: ${lead2.title} (${lead2.status})`);

  const deal1 = await prisma.deal.upsert({
    where: { id: 'dl-001' },
    update: {},
    create: {
      id: 'dl-001',
      orgId: org.id,
      name: 'Acme Pilot Project',
      value: 12000,
      currency: 'USD',
      companyId: acme.id,
      stage: 'Prospecting',
      status: 'OPEN',
    },
  });
  console.log(`✅ Deal: ${deal1.name} ($${deal1.value})`);

  const deal2 = await prisma.deal.upsert({
    where: { id: 'dl-002' },
    update: {},
    create: {
      id: 'dl-002',
      orgId: org.id,
      name: 'Enterprise Package',
      value: 50000,
      currency: 'USD',
      companyId: acme.id,
      stage: 'Negotiation',
      status: 'OPEN',
    },
  });
  console.log(`✅ Deal: ${deal2.name} ($${deal2.value})`);

  console.log('\n✅ Seed complete for org:', org.id);
  console.log('\n📊 Summary:');
  console.log(`   - 1 Org`);
  console.log(`   - 1 Company`);
  console.log(`   - 2 Contacts`);
  console.log(`   - 2 Leads`);
  console.log(`   - 2 Deals`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

