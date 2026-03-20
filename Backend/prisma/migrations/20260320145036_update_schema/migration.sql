/*
  Warnings:

  - The primary key for the `thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `danhMucId` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `donViTinh` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `gia` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `hanSuDung` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `soLuong` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `tenThuoc` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the `benhnhan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chitietdonthuoc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `danhmucthuoc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `donthuoc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lichhen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nhanvien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `phieukham` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taikhoan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `thanhtoan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gia_thuoc` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_danh_muc` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_thuoc` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `so_luong` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_thuoc` to the `thuoc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chitietdonthuoc` DROP FOREIGN KEY `ChiTietDonThuoc_donThuocId_fkey`;

-- DropForeignKey
ALTER TABLE `chitietdonthuoc` DROP FOREIGN KEY `ChiTietDonThuoc_thuocId_fkey`;

-- DropForeignKey
ALTER TABLE `donthuoc` DROP FOREIGN KEY `DonThuoc_phieuKhamId_fkey`;

-- DropForeignKey
ALTER TABLE `lichhen` DROP FOREIGN KEY `LichHen_bacSiId_fkey`;

-- DropForeignKey
ALTER TABLE `lichhen` DROP FOREIGN KEY `LichHen_benhNhanId_fkey`;

-- DropForeignKey
ALTER TABLE `phieukham` DROP FOREIGN KEY `PhieuKham_bacSiId_fkey`;

-- DropForeignKey
ALTER TABLE `phieukham` DROP FOREIGN KEY `PhieuKham_benhNhanId_fkey`;

-- DropForeignKey
ALTER TABLE `taikhoan` DROP FOREIGN KEY `TaiKhoan_nhanVienId_fkey`;

-- DropForeignKey
ALTER TABLE `thanhtoan` DROP FOREIGN KEY `ThanhToan_phieuKhamId_fkey`;

-- DropForeignKey
ALTER TABLE `thuoc` DROP FOREIGN KEY `Thuoc_danhMucId_fkey`;

-- DropIndex
DROP INDEX `Thuoc_danhMucId_fkey` ON `thuoc`;

-- AlterTable
ALTER TABLE `thuoc` DROP PRIMARY KEY,
    DROP COLUMN `danhMucId`,
    DROP COLUMN `donViTinh`,
    DROP COLUMN `gia`,
    DROP COLUMN `hanSuDung`,
    DROP COLUMN `id`,
    DROP COLUMN `soLuong`,
    DROP COLUMN `tenThuoc`,
    ADD COLUMN `don_vi_tinh` VARCHAR(191) NULL,
    ADD COLUMN `gia_thuoc` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `han_su_dung` DATETIME(3) NULL,
    ADD COLUMN `id_danh_muc` INTEGER NOT NULL,
    ADD COLUMN `id_thuoc` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `so_luong` INTEGER NOT NULL,
    ADD COLUMN `ten_thuoc` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_thuoc`);

-- DropTable
DROP TABLE `benhnhan`;

-- DropTable
DROP TABLE `chitietdonthuoc`;

-- DropTable
DROP TABLE `danhmucthuoc`;

-- DropTable
DROP TABLE `donthuoc`;

-- DropTable
DROP TABLE `lichhen`;

-- DropTable
DROP TABLE `nhanvien`;

-- DropTable
DROP TABLE `phieukham`;

-- DropTable
DROP TABLE `taikhoan`;

-- DropTable
DROP TABLE `thanhtoan`;

-- CreateTable
CREATE TABLE `nhan_vien` (
    `id_nhan_vien` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_nhan_vien` VARCHAR(191) NOT NULL,
    `ngay_sinh` DATETIME(3) NULL,
    `gioi_tinh` ENUM('NAM', 'NU', 'KHAC') NULL,
    `so_dien_thoai` VARCHAR(191) NULL,
    `dia_chi` VARCHAR(191) NULL,
    `chuc_vu` VARCHAR(191) NOT NULL,
    `chuyen_khoa` VARCHAR(191) NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nhan_vien_so_dien_thoai_key`(`so_dien_thoai`),
    PRIMARY KEY (`id_nhan_vien`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tai_khoan` (
    `id_tai_khoan` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_dang_nhap` VARCHAR(191) NOT NULL,
    `mat_khau` VARCHAR(191) NOT NULL,
    `vai_tro` ENUM('ADMIN', 'BAC_SI', 'LE_TAN', 'THU_NGAN') NOT NULL,
    `trang_thai` ENUM('HOAT_DONG', 'KHOA') NOT NULL DEFAULT 'HOAT_DONG',
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,
    `id_nhan_vien` INTEGER NULL,

    UNIQUE INDEX `tai_khoan_ten_dang_nhap_key`(`ten_dang_nhap`),
    UNIQUE INDEX `tai_khoan_id_nhan_vien_key`(`id_nhan_vien`),
    PRIMARY KEY (`id_tai_khoan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `benh_nhan` (
    `id_benh_nhan` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_benh_nhan` VARCHAR(191) NOT NULL,
    `ngay_sinh` DATETIME(3) NULL,
    `gioi_tinh` ENUM('NAM', 'NU', 'KHAC') NULL,
    `so_dien_thoai` VARCHAR(191) NULL,
    `dia_chi` VARCHAR(191) NULL,
    `tien_su_benh` VARCHAR(191) NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `benh_nhan_so_dien_thoai_key`(`so_dien_thoai`),
    PRIMARY KEY (`id_benh_nhan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lich_hen` (
    `id_lich_hen` INTEGER NOT NULL AUTO_INCREMENT,
    `thoi_gian_hen` DATETIME(3) NOT NULL,
    `ly_do_kham` VARCHAR(191) NULL,
    `trang_thai` ENUM('DA_DAT', 'CHO_KHAM', 'DA_KHAM', 'DA_HUY') NOT NULL DEFAULT 'DA_DAT',
    `id_benh_nhan` INTEGER NOT NULL,
    `id_nhan_vien` INTEGER NOT NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lich_hen_id_benh_nhan_idx`(`id_benh_nhan`),
    INDEX `lich_hen_id_nhan_vien_idx`(`id_nhan_vien`),
    UNIQUE INDEX `lich_hen_id_nhan_vien_thoi_gian_hen_key`(`id_nhan_vien`, `thoi_gian_hen`),
    PRIMARY KEY (`id_lich_hen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phieu_kham` (
    `id_phieu_kham` INTEGER NOT NULL AUTO_INCREMENT,
    `ngay_kham` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `trieu_chung` VARCHAR(191) NULL,
    `chan_doan` VARCHAR(191) NULL,
    `ghi_chu` VARCHAR(191) NULL,
    `id_benh_nhan` INTEGER NOT NULL,
    `id_nhan_vien` INTEGER NOT NULL,

    INDEX `phieu_kham_id_benh_nhan_idx`(`id_benh_nhan`),
    INDEX `phieu_kham_id_nhan_vien_idx`(`id_nhan_vien`),
    PRIMARY KEY (`id_phieu_kham`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `don_thuoc` (
    `id_don_thuoc` INTEGER NOT NULL AUTO_INCREMENT,
    `ngay_ke_don` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ghi_chu` VARCHAR(191) NULL,
    `id_phieu_kham` INTEGER NOT NULL,

    UNIQUE INDEX `don_thuoc_id_phieu_kham_key`(`id_phieu_kham`),
    PRIMARY KEY (`id_don_thuoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_don_thuoc` (
    `id_chi_tiet` INTEGER NOT NULL AUTO_INCREMENT,
    `so_luong` INTEGER NOT NULL,
    `lieu_dung` VARCHAR(191) NULL,
    `gia_tai_thoi_diem` DECIMAL(10, 2) NOT NULL,
    `id_don_thuoc` INTEGER NOT NULL,
    `id_thuoc` INTEGER NOT NULL,

    INDEX `chi_tiet_don_thuoc_id_don_thuoc_idx`(`id_don_thuoc`),
    INDEX `chi_tiet_don_thuoc_id_thuoc_idx`(`id_thuoc`),
    PRIMARY KEY (`id_chi_tiet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc_thuoc` (
    `id_danh_muc` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(191) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,

    PRIMARY KEY (`id_danh_muc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanh_toan` (
    `id_thanh_toan` INTEGER NOT NULL AUTO_INCREMENT,
    `tong_tien` DECIMAL(10, 2) NOT NULL,
    `phuong_thuc` ENUM('TIEN_MAT', 'CHUYEN_KHOAN') NULL,
    `trang_thai` ENUM('CHUA_THANH_TOAN', 'DA_THANH_TOAN') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    `ngay_thanh_toan` DATETIME(3) NULL,
    `id_phieu_kham` INTEGER NOT NULL,

    UNIQUE INDEX `thanh_toan_id_phieu_kham_key`(`id_phieu_kham`),
    PRIMARY KEY (`id_thanh_toan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tai_khoan` ADD CONSTRAINT `tai_khoan_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hen` ADD CONSTRAINT `lich_hen_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id_benh_nhan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hen` ADD CONSTRAINT `lich_hen_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id_benh_nhan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_thuoc` ADD CONSTRAINT `don_thuoc_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_don_thuoc_fkey` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc`(`id_don_thuoc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_thuoc_fkey` FOREIGN KEY (`id_thuoc`) REFERENCES `thuoc`(`id_thuoc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thuoc` ADD CONSTRAINT `thuoc_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc_thuoc`(`id_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;
