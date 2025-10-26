-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "size" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "title" TEXT,
    "companyId" TEXT,
    "ownerId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSource" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "contactId" TEXT,
    "sourceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "score" INTEGER NOT NULL DEFAULT 0,
    "ownerId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "probability" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stageId" TEXT NOT NULL,
    "ownerId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "dataJson" JSONB,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagAssignment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedView" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Org_slug_key" ON "Org"("slug");

-- CreateIndex
CREATE INDEX "Org_slug_idx" ON "Org"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Company_orgId_idx" ON "Company"("orgId");

-- CreateIndex
CREATE INDEX "Company_domain_idx" ON "Company"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_orgId_idx" ON "Contact"("orgId");

-- CreateIndex
CREATE INDEX "Contact_companyId_idx" ON "Contact"("companyId");

-- CreateIndex
CREATE INDEX "Contact_ownerId_idx" ON "Contact"("ownerId");

-- CreateIndex
CREATE INDEX "LeadSource_orgId_idx" ON "LeadSource"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadSource_orgId_name_key" ON "LeadSource"("orgId", "name");

-- CreateIndex
CREATE INDEX "Lead_orgId_idx" ON "Lead"("orgId");

-- CreateIndex
CREATE INDEX "Lead_contactId_idx" ON "Lead"("contactId");

-- CreateIndex
CREATE INDEX "Lead_sourceId_idx" ON "Lead"("sourceId");

-- CreateIndex
CREATE INDEX "Lead_ownerId_idx" ON "Lead"("ownerId");

-- CreateIndex
CREATE INDEX "Pipeline_orgId_idx" ON "Pipeline"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_orgId_name_key" ON "Pipeline"("orgId", "name");

-- CreateIndex
CREATE INDEX "Stage_orgId_idx" ON "Stage"("orgId");

-- CreateIndex
CREATE INDEX "Stage_pipelineId_idx" ON "Stage"("pipelineId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_pipelineId_name_key" ON "Stage"("pipelineId", "name");

-- CreateIndex
CREATE INDEX "Deal_orgId_idx" ON "Deal"("orgId");

-- CreateIndex
CREATE INDEX "Deal_stageId_idx" ON "Deal"("stageId");

-- CreateIndex
CREATE INDEX "Deal_ownerId_idx" ON "Deal"("ownerId");

-- CreateIndex
CREATE INDEX "Deal_contactId_idx" ON "Deal"("contactId");

-- CreateIndex
CREATE INDEX "Deal_companyId_idx" ON "Deal"("companyId");

-- CreateIndex
CREATE INDEX "Activity_orgId_idx" ON "Activity"("orgId");

-- CreateIndex
CREATE INDEX "Activity_entityType_entityId_idx" ON "Activity"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Activity_authorId_idx" ON "Activity"("authorId");

-- CreateIndex
CREATE INDEX "Tag_orgId_idx" ON "Tag"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_orgId_name_key" ON "Tag"("orgId", "name");

-- CreateIndex
CREATE INDEX "TagAssignment_orgId_idx" ON "TagAssignment"("orgId");

-- CreateIndex
CREATE INDEX "TagAssignment_entityType_entityId_idx" ON "TagAssignment"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "TagAssignment_tagId_entityType_entityId_key" ON "TagAssignment"("tagId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "SavedView_orgId_userId_idx" ON "SavedView"("orgId", "userId");

-- CreateIndex
CREATE INDEX "SavedView_orgId_isDefault_idx" ON "SavedView"("orgId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "SavedView_orgId_userId_name_key" ON "SavedView"("orgId", "userId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadSource" ADD CONSTRAINT "LeadSource_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "LeadSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagAssignment" ADD CONSTRAINT "TagAssignment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagAssignment" ADD CONSTRAINT "TagAssignment_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

