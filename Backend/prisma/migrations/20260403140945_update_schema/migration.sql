-- AlterTable
ALTER TABLE `phieu_kham` ADD COLUMN `trang_thai` ENUM('DANG_KHAM', 'HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'DANG_KHAM';

-- CreateTable
CREATE TABLE `danh_muc_dich_vu` (
    `id_danh_muc` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(191) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,

    PRIMARY KEY (`id_danh_muc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dich_vu` (
    `id_dich_vu` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_dich_vu` VARCHAR(191) NOT NULL,
    `gia_dich_vu` DECIMAL(10, 2) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `id_danh_muc` INTEGER NOT NULL,

    PRIMARY KEY (`id_dich_vu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_dich_vu` (
    `id_chi_tiet` INTEGER NOT NULL AUTO_INCREMENT,
    `so_luong` INTEGER NOT NULL DEFAULT 1,
    `gia_tai_thoi_diem` DECIMAL(10, 2) NOT NULL,
    `trang_thai` ENUM('CHO_THUC_HIEN', 'DANG_THUC_HIEN', 'HOAN_THANH') NOT NULL DEFAULT 'CHO_THUC_HIEN',
    `id_phieu_kham` INTEGER NOT NULL,
    `id_dich_vu` INTEGER NOT NULL,
    `id_nhan_vien` INTEGER NULL,

    PRIMARY KEY (`id_chi_tiet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dich_vu` ADD CONSTRAINT `dich_vu_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc_dich_vu`(`id_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_dich_vu_fkey` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu`(`id_dich_vu`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;
