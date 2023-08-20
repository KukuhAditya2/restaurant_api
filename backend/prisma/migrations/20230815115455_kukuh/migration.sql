-- CreateTable
CREATE TABLE `users` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `uuid` VARCHAR(191) NOT NULL,
    `sku` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `stock` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `uuid` VARCHAR(191) NOT NULL,
    `total_price` FLOAT NOT NULL,
    `total_paid` FLOAT NOT NULL,
    `total_kembalian` FLOAT NOT NULL,
    `tanda_terima` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_history` (
    `uuid` VARCHAR(191) NOT NULL,
    `totalPrice` FLOAT NOT NULL,
    `totalPaid` FLOAT NOT NULL,
    `totalKembalian` FLOAT NOT NULL,
    `status` VARCHAR(100) NOT NULL DEFAULT 'belum di bayar',
    `orderId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `orders_history_orderId_key`(`orderId`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_details` (
    `uuid` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `orderId` VARCHAR(100) NOT NULL,
    `productId` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `session` JSON NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_history` ADD CONSTRAINT `orders_history_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_details` ADD CONSTRAINT `orders_details_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_details` ADD CONSTRAINT `orders_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
