-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "curricular_units_1st_sem_approved" INTEGER,
ADD COLUMN     "curricular_units_1st_sem_credited" INTEGER,
ADD COLUMN     "curricular_units_1st_sem_enrolled" INTEGER,
ADD COLUMN     "curricular_units_1st_sem_evaluations" INTEGER,
ADD COLUMN     "curricular_units_1st_sem_grade" DOUBLE PRECISION,
ADD COLUMN     "curricular_units_1st_sem_without_evaluations" INTEGER,
ADD COLUMN     "curricular_units_2nd_sem_approved" INTEGER,
ADD COLUMN     "curricular_units_2nd_sem_credited" INTEGER,
ADD COLUMN     "curricular_units_2nd_sem_enrolled" INTEGER,
ADD COLUMN     "curricular_units_2nd_sem_evaluations" INTEGER,
ADD COLUMN     "curricular_units_2nd_sem_grade" DOUBLE PRECISION,
ADD COLUMN     "curricular_units_2nd_sem_without_evaluations" INTEGER;
