-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT '',
ALTER COLUMN "addressCompany" SET DEFAULT '',
ALTER COLUMN "emailAdmin" SET DEFAULT '',
ALTER COLUMN "emailCompany" SET DEFAULT '',
ALTER COLUMN "firstName" SET DEFAULT '',
ALTER COLUMN "lastName" SET DEFAULT '',
ALTER COLUMN "nameCompany" SET DEFAULT '',
ALTER COLUMN "phoneNumberAdmin" SET DEFAULT '',
ALTER COLUMN "phoneNumberCompany" SET DEFAULT '',
ALTER COLUMN "terms" DROP NOT NULL,
ALTER COLUMN "terms" SET DEFAULT false;