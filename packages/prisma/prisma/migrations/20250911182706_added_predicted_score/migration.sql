-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "attendance_percentage" INTEGER,
ADD COLUMN     "diet_quality" TEXT,
ADD COLUMN     "exercise_hours" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "mental_health" INTEGER,
ADD COLUMN     "parental_education_level" TEXT,
ADD COLUMN     "part_time_job" TEXT,
ADD COLUMN     "predictedscore" DOUBLE PRECISION,
ADD COLUMN     "sleep_hours" INTEGER,
ADD COLUMN     "social_media_hours" INTEGER,
ADD COLUMN     "study_hours_per_day" INTEGER;
