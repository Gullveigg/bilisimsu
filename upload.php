<?php
/**
 * PHP Upload Script — bilisimsuaritma
 * Bu dosyayı PHP sunucunun root dizinine koy (public_html/upload.php)
 * PHP_UPLOAD_SECRET ile buradaki SECRET_KEY aynı olmalı.
 */

define('SECRET_KEY', 'buraya-guclu-bir-anahtar'); // .env'deki PHP_UPLOAD_SECRET ile aynı yap
define('UPLOAD_DIR', __DIR__ . '/slides/');
define('BASE_URL', 'https://sunucuadresin.com/slides/'); // Sunucu adresinle değiştir

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Secret key doğrula
$secret = $_POST['secret'] ?? '';
if (!hash_equals(SECRET_KEY, $secret)) {
    http_response_code(403);
    echo json_encode(['error' => 'Yetkisiz erişim.']);
    exit;
}

// Dosya kontrolü
if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Dosya bulunamadı veya yükleme hatası.']);
    exit;
}

$file = $_FILES['file'];
$allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, $allowedMimes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Desteklenmeyen dosya türü: ' . $mimeType]);
    exit;
}

$maxSize = 100 * 1024 * 1024; // 100 MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Dosya çok büyük (max 100 MB).']);
    exit;
}

// Benzersiz dosya adı oluştur
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = time() . '-' . bin2hex(random_bytes(6)) . '.' . strtolower($ext);

// Upload klasörünü oluştur
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

$destination = UPLOAD_DIR . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['error' => 'Dosya kaydedilemedi.']);
    exit;
}

echo json_encode(['url' => BASE_URL . $filename]);
