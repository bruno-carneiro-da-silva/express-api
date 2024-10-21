-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
-- Verifique se a coluna "companyId" já existe antes de tentar adicioná-la
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Contact' AND column_name='companyId') THEN
        ALTER TABLE "Contact" ADD COLUMN "companyId" TEXT;
    END IF;
END $$;

ALTER TABLE "Contact" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='description') THEN
        ALTER TABLE "Product" ADD COLUMN "description" TEXT NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='size') THEN
        ALTER TABLE "Product" ADD COLUMN "size" TEXT NOT NULL;
    END IF;
    ALTER TABLE "Product" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
END $$;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
-- Verifique se a coluna "userId" existe antes de tentar removê-la
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Sale' AND column_name='userId') THEN
        ALTER TABLE "Sale" DROP COLUMN "userId";
    END IF;
END $$;

-- Verifique se a coluna "companyId" já existe antes de tentar adicioná-la
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Sale' AND column_name='companyId') THEN
        ALTER TABLE "Sale" ADD COLUMN "companyId" TEXT;
    END IF;
END $$;

ALTER TABLE "SoldItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
-- Verifique se a coluna "userId" existe antes de tentar removê-la
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Supplier' AND column_name='userId') THEN
        ALTER TABLE "Supplier" DROP COLUMN "userId";
    END IF;
END $$;

-- Verifique se a coluna "companyId" já existe antes de tentar adicioná-la
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Supplier' AND column_name='companyId') THEN
        ALTER TABLE "Supplier" ADD COLUMN "companyId" TEXT;
    END IF;
END $$;

ALTER TABLE "Transaction" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='User') THEN
        DROP TABLE "User";
    END IF;
END $$;

-- CreateTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='Company') THEN
        CREATE TABLE "Company" (
            "id" TEXT NOT NULL,
            "firstName" TEXT NOT NULL DEFAULT '',
            "lastName" TEXT NOT NULL DEFAULT '',
            "emailAdmin" TEXT NOT NULL DEFAULT '',
            "phoneNumberAdmin" TEXT NOT NULL DEFAULT '',
            "password" TEXT NOT NULL,
            "nameCompany" TEXT NOT NULL DEFAULT '',
            "emailCompany" TEXT NOT NULL DEFAULT '',
            "phoneNumberCompany" TEXT NOT NULL DEFAULT '',
            "addressCompany" TEXT NOT NULL DEFAULT '',
            "terms" BOOLEAN DEFAULT false,
            "refreshToken" TEXT,
            "verificationCode" TEXT,
            "verificationCodeExpiresAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "planId" TEXT,
            "roleId" INTEGER,
            CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='Plan') THEN
        CREATE TABLE "Plan" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "price" DOUBLE PRECISION NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='Feature') THEN
        CREATE TABLE "Feature" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "planId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='Price') THEN
        CREATE TABLE "Price" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "price" DOUBLE PRECISION NOT NULL,
            "benefits" TEXT,
            "planId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='Photo') THEN
        CREATE TABLE "Photo" (
            "id" TEXT NOT NULL,
            "url" TEXT NOT NULL,
            "productId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Company_emailAdmin_key" ON "Company"("emailAdmin");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Company_phoneNumberAdmin_key" ON "Company"("phoneNumberAdmin");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Company' AND constraint_name='Company_planId_fkey') THEN
        ALTER TABLE "Company" ADD CONSTRAINT "Company_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Company' AND constraint_name='Company_roleId_fkey') THEN
        ALTER TABLE "Company" ADD CONSTRAINT "Company_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Feature' AND constraint_name='Feature_planId_fkey') THEN
        ALTER TABLE "Feature" ADD CONSTRAINT "Feature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Price' AND constraint_name='Price_planId_fkey') THEN
        ALTER TABLE "Price" ADD CONSTRAINT "Price_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Contact' AND constraint_name='Contact_companyId_fkey') THEN
        ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Supplier' AND constraint_name='Supplier_companyId_fkey') THEN
        ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='Photo' AND constraint_name='Photo_productId_fkey') THEN
        ALTER TABLE "Photo" ADD CONSTRAINT "Photo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
