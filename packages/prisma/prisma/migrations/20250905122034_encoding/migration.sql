-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "encoding" vector(4096);
