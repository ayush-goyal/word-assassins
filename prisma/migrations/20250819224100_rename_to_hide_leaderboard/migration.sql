-- AlterTable - Rename column from showLeaderboard to hideLeaderboard
ALTER TABLE "Game" RENAME COLUMN "showLeaderboard" TO "hideLeaderboard";

-- Update existing values (invert the boolean values)
UPDATE "Game" SET "hideLeaderboard" = NOT "hideLeaderboard";

-- Change default value
ALTER TABLE "Game" ALTER COLUMN "hideLeaderboard" SET DEFAULT false;