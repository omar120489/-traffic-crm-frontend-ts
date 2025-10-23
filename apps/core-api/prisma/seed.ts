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
      domain: 'acme.com',
    },
  });
  console.log(`✅ Company: ${acme.name}`);

  const john = await prisma.contact.upsert({
    where: { id: 'ct-john' },
    update: {},
    create: {
      id: 'ct-john',
      orgId: org.id,
      name: 'John Doe',
      email: 'john.doe@acme.com',
      phone: '+1-555-0100',
      companyId: acme.id,
    },
  });
  console.log(`✅ Contact: ${john.name} (${john.email})`);

  const jane = await prisma.contact.upsert({
    where: { id: 'ct-jane' },
    update: {},
    create: {
      id: 'ct-jane',
      orgId: org.id,
      name: 'Jane Smith',
      email: 'jane.smith@acme.com',
      phone: '+1-555-0101',
      companyId: acme.id,
    },
  });
  console.log(`✅ Contact: ${jane.name} (${jane.email})`);

  const lead1 = await prisma.lead.upsert({
    where: { id: 'ld-001' },
    update: {},
    create: {
      id: 'ld-001',
      orgId: org.id,
      contactId: john.id,
      status: 'new',
      source: 'website',
      score: 75,
    },
  });
  console.log(`✅ Lead: From ${john.name} (${lead1.status})`);

  const lead2 = await prisma.lead.upsert({
    where: { id: 'ld-002' },
    update: {},
    create: {
      id: 'ld-002',
      orgId: org.id,
      contactId: jane.id,
      status: 'new',
      source: 'referral',
      score: 85,
    },
  });
  console.log(`✅ Lead: From ${jane.name} (${lead2.status})`);

  const deal1 = await prisma.deal.upsert({
    where: { id: 'dl-001' },
    update: {},
    create: {
      id: 'dl-001',
      orgId: org.id,
      title: 'Acme Pilot Project',
      amountCents: 1200000,
      currency: 'USD',
      companyId: acme.id,
      stage: 'new',
    },
  });
  console.log(`✅ Deal: ${deal1.title} ($${deal1.amountCents / 100})`);

  const deal2 = await prisma.deal.upsert({
    where: { id: 'dl-002' },
    update: {},
    create: {
      id: 'dl-002',
      orgId: org.id,
      title: 'Enterprise Package',
      amountCents: 5000000,
      currency: 'USD',
      companyId: acme.id,
      stage: 'new',
    },
  });
  console.log(`✅ Deal: ${deal2.title} ($${deal2.amountCents / 100})`);

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

