/*
  Warnings:

  - You are about to drop the column `foodId` on the `ImagePath` table. All the data in the column will be lost.
  - You are about to drop the column `imagePathId` on the `users` table. All the data in the column will be lost.
  - Added the required column `picturePath` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImagePath" DROP CONSTRAINT "ImagePath_foodId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_imagePathId_fkey";

-- AlterTable
ALTER TABLE "ImagePath" DROP COLUMN "foodId";

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "picturePath" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "imagePathId",
ADD COLUMN     "picturePath" TEXT NOT NULL;
