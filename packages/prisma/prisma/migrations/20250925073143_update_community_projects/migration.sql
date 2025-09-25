-- DropForeignKey
ALTER TABLE "public"."CommunityProject" DROP CONSTRAINT "CommunityProject_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reward" DROP CONSTRAINT "Reward_studentId_communityProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentProject" DROP CONSTRAINT "StudentProject_communityProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentProject" DROP CONSTRAINT "StudentProject_studentId_fkey";

-- AlterTable - First add columns as optional with defaults
ALTER TABLE "public"."CommunityProject" 
DROP COLUMN "partnerId",
DROP COLUMN "status", 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
ADD COLUMN "details" TEXT, 
ADD COLUMN "domain" TEXT DEFAULT 'General', 
ADD COLUMN "imageUrl" TEXT, 
ADD COLUMN "mentorId" TEXT, 
ADD COLUMN "organization" TEXT DEFAULT 'Default Organization', 
ADD COLUMN "reward" INTEGER;

-- Add projectId column with a temporary default
ALTER TABLE "public"."CommunityProject" ADD COLUMN "projectId" TEXT DEFAULT 'TEMP-ID';

-- Update existing rows with proper mentor ID (get the first available mentor)
UPDATE "public"."CommunityProject" SET "mentorId" = (
  SELECT "id" FROM "public"."Mentor" LIMIT 1
) WHERE "mentorId" IS NULL;

-- Update projectId to be unique by using the existing id
UPDATE "public"."CommunityProject" SET "projectId" = 'PROJ-' || SUBSTRING("id", 1, 8);

-- Now make the required columns NOT NULL
ALTER TABLE "public"."CommunityProject" ALTER COLUMN "domain" SET NOT NULL;
ALTER TABLE "public"."CommunityProject" ALTER COLUMN "mentorId" SET NOT NULL;
ALTER TABLE "public"."CommunityProject" ALTER COLUMN "organization" SET NOT NULL;
ALTER TABLE "public"."CommunityProject" ALTER COLUMN "projectId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."CommunityPartner";

-- DropTable
DROP TABLE "public"."Reward";

-- DropTable
DROP TABLE "public"."StudentProject";

-- CreateTable
CREATE TABLE "public"."CommunityProjectSubmission" (
    "id" TEXT NOT NULL,
    "answerText" TEXT,
    "answerImageUrl" TEXT,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "studentId" TEXT NOT NULL,
    "communityProjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityProjectSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityProject_projectId_key" ON "public"."CommunityProject"("projectId");

-- AddForeignKey
ALTER TABLE "public"."CommunityProject" ADD CONSTRAINT "CommunityProject_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityProjectSubmission" ADD CONSTRAINT "CommunityProjectSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityProjectSubmission" ADD CONSTRAINT "CommunityProjectSubmission_communityProjectId_fkey" FOREIGN KEY ("communityProjectId") REFERENCES "public"."CommunityProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;