<?php
// app/api/upload/route.ts → PHP_API_URL/upload.php
// Multipart dosya yükler, UPLOAD_DIR klasörüne kaydeder, JSON {url: "..."} döndürür
// Mevcut /upload.php (root) yerine geçer — config.php'deki UPLOAD_DIR ve UPLOAD_BASE_URL kullanılır
require_once __DIR__ . '/config.php';
cors();

if (method() !== 'POST') err('Method not allowed.', 405);

requireAdmin();

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    err('Dosya bulunamadı veya yükleme hatası.');
}

$file    = $_FILES['file'];
$allowed = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];
$finfo   = new finfo(FILEINFO_MIME_TYPE);
$mime    = $finfo->file($file['tmp_name']);

if (!in_array($mime, $allowed, true)) err('Desteklenmeyen dosya türü: ' . $mime);
if ($file['size'] > 100 * 1024 * 1024) err('Dosya çok büyük (max 100 MB).');

if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$filename = time() . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
$dest     = UPLOAD_DIR . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) err('Dosya kaydedilemedi.', 500);

ok(['url' => UPLOAD_BASE_URL . '/' . $filename]);
