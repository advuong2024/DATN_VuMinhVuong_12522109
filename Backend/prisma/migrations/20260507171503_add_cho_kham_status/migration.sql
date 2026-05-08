-- DropForeignKey
ALTER TABLE `thanh_toan_chi_tiet` DROP FOREIGN KEY `thanh_toan_chi_tiet_fk`;

-- AlterTable
ALTER TABLE `phieu_kham` MODIFY `trang_thai` ENUM('CHO_KHAM', 'DANG_KHAM', 'HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'DANG_KHAM';

-- AlterTable
ALTER TABLE `thanh_toan` MODIFY `loai_thanh_toan` ENUM('PHI_KHAM', 'DICH_VU', 'THUOC') NULL;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan_chi_tiet` ADD CONSTRAINT `thanh_toan_chi_tiet_id_thanh_toan_fkey` FOREIGN KEY (`id_thanh_toan`) REFERENCES `thanh_toan`(`id_thanh_toan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `thanh_toan` RENAME INDEX `thanh_toan_unique` TO `thanh_toan_id_phieu_kham_loai_thanh_toan_key`;

-- RenameIndex
ALTER TABLE `thanh_toan_chi_tiet` RENAME INDEX `thanh_toan_chi_tiet_unique` TO `thanh_toan_chi_tiet_id_thanh_toan_loai_item_id_item_key`;
