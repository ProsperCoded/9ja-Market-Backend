/*
  Warnings:

  - You are about to drop the column `credentialsUrl` on the `Marketer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Marketer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IdentityCredentialImage` to the `Marketer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdentityCredentialType` to the `Marketer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Marketer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MERCHANT';

