-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('BUSINESS', 'STUDENT', 'COLLABORATION', 'GENERAL');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('TECHNICAL_INTERNSHIP', 'PROJECT_APPRENTICESHIP', 'RESEARCH_FELLOWSHIP');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "MentorCollaborationType" AS ENUM ('MENTOR_STUDENTS', 'CONDUCT_WORKSHOP', 'ARCHITECTURE_REVIEW', 'PROJECT_COLLABORATION', 'CONSULTING_PARTNERSHIP');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETED', 'DEMONSTRATION', 'PROTOTYPE', 'WORK_IN_PROGRESS');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'REVIEWER');

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL DEFAULT 'GENERAL',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "projectCategory" TEXT,
    "budgetRange" TEXT,
    "timeline" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL DEFAULT 'TECHNICAL_INTERNSHIP',
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "skills" TEXT[],
    "duration" TEXT NOT NULL,
    "locationMode" TEXT NOT NULL DEFAULT 'Remote',
    "compensationStatus" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "availablePositions" INTEGER NOT NULL DEFAULT 1,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipApplication" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "education" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "motivationStatement" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "linkedInUrl" TEXT,
    "resumeUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "internalNotes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorInquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "areaOfExpertise" TEXT NOT NULL,
    "collaborationPreference" "MentorCollaborationType" NOT NULL DEFAULT 'MENTOR_STUDENTS',
    "linkedInOrWebsiteUrl" TEXT,
    "introduction" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "technologies" TEXT[],
    "category" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DEMONSTRATION',
    "thumbnailUrl" TEXT,
    "demoUrl" TEXT,
    "repoUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "mfaRecoveryCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tokenVersion" INTEGER NOT NULL DEFAULT 1,
    "lastMfaStep" INTEGER,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inquiry_email_idx" ON "Inquiry"("email");

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipOpportunity_slug_key" ON "InternshipOpportunity"("slug");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_slug_idx" ON "InternshipOpportunity"("slug");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_published_idx" ON "InternshipOpportunity"("published");

-- CreateIndex
CREATE INDEX "InternshipApplication_opportunityId_idx" ON "InternshipApplication"("opportunityId");

-- CreateIndex
CREATE INDEX "InternshipApplication_email_idx" ON "InternshipApplication"("email");

-- CreateIndex
CREATE INDEX "InternshipApplication_status_idx" ON "InternshipApplication"("status");

-- CreateIndex
CREATE INDEX "MentorInquiry_email_idx" ON "MentorInquiry"("email");

-- CreateIndex
CREATE INDEX "MentorInquiry_status_idx" ON "MentorInquiry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_idx" ON "Project"("published");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
