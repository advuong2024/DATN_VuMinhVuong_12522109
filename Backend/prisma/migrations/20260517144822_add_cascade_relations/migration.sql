-- DropForeignKey
ALTER TABLE `chi_tiet_dich_vu` DROP FOREIGN KEY `chi_tiet_dich_vu_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `chi_tiet_don_thuoc` DROP FOREIGN KEY `chi_tiet_don_thuoc_id_don_thuoc_fkey`;

-- DropForeignKey
ALTER TABLE `don_thuoc` DROP FOREIGN KEY `don_thuoc_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `thanh_toan` DROP FOREIGN KEY `thanh_toan_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `thanh_toan_chi_tiet` DROP FOREIGN KEY `thanh_toan_chi_tiet_id_thanh_toan_fkey`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_phieu_kham_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_don_thuoc_id_don_thuoc_fkey` ON `chi_tiet_don_thuoc`;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_thuoc` ADD CONSTRAINT `don_thuoc_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_don_thuoc_fkey` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc`(`id_don_thuoc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan_chi_tiet` ADD CONSTRAINT `thanh_toan_chi_tiet_id_thanh_toan_fkey` FOREIGN KEY (`id_thanh_toan`) REFERENCES `thanh_toan`(`id_thanh_toan`) ON DELETE CASCADE ON UPDATE CASCADE;
