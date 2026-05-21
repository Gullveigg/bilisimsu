<?php
/**
 * Bilişim Su Arıtma — PHP Backend Config
 * PHP sunucusuna koyulacak dosyalar: backend/ klasörünün içeriği
 *
 * .env veya sunucu ortam değişkenleri ile yapılandırın:
 *   MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASS
 *   ADMIN_SECRET  (Next.js ADMIN_SECRET ile aynı olmalı)
 *   UPLOAD_BASE_URL (örn: https://sunucuadresin.com/api/uploads)
 */

define('DB_HOST',        'localhost');
define('DB_NAME',        'serkantuna_bilisimsuaritma');
define('DB_USER',        getenv('MYSQL_USER') ?: 'MYSQL_KULLANICI_ADI');
define('DB_PASS',        getenv('MYSQL_PASS') ?: 'MYSQL_SIFRE');
define('ADMIN_SECRET',   'bilisim-super-gizli-2024');
define('UPLOAD_DIR',     __DIR__ . '/uploads/');
define('UPLOAD_BASE_URL', 'https://api.bilisimsuaritma.com.tr/uploads');

// ── PDO bağlantısı ──────────────────────────────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

// ── CORS + JSON başlıkları ───────────────────────────────────────────────────
function cors(): void {
    $allowed = getenv('ALLOWED_ORIGIN') ?: '*';
    header("Access-Control-Allow-Origin: $allowed");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Secret');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function requireAdmin(): void {
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['HTTP_X_ADMIN_SECRET']
        ?? '';
    $token = str_replace('Bearer ', '', trim($header));
    if (!hash_equals(ADMIN_SECRET, $token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Yetkisiz erişim.']);
        exit;
    }
}

// ── JSON body ────────────────────────────────────────────────────────────────
function body(): array {
    static $data = null;
    if ($data === null) {
        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true) ?? [];
    }
    return $data;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function cuid(): string {
    return 'c' . bin2hex(random_bytes(12));
}

function makeSlug(string $str): string {
    $map = ['ş'=>'s','ğ'=>'g','ü'=>'u','ı'=>'i','ö'=>'o','ç'=>'c',
            'Ş'=>'s','Ğ'=>'g','Ü'=>'u','İ'=>'i','Ö'=>'o','Ç'=>'c'];
    $str = mb_strtolower(strtr($str, $map), 'UTF-8');
    $str = preg_replace('/[^a-z0-9\s\-]/', '', $str);
    return preg_replace('/[\s\-]+/', '-', trim($str));
}

function ok(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function err(string $msg, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function method(): string {
    return $_SERVER['REQUEST_METHOD'];
}

function qid(): ?string {
    return $_GET['id'] ?? null;
}

function toBoolInt(mixed $v): int {
    return ($v === true || $v === 1 || $v === '1' || $v === 'true') ? 1 : 0;
}

// ── Row mappers (snake_case DB → camelCase JSON) ─────────────────────────────
function mapProduct(array $r): array {
    $p = [
        'id'               => $r['id'],
        'name'             => $r['name'],
        'slug'             => $r['slug'],
        'shortDescription' => $r['short_description'],
        'description'      => $r['description'],
        'technicalSpecs'   => $r['technical_specs'],
        'price'            => $r['price'],
        'imageUrl'         => $r['image_url'],
        'imageGallery'     => $r['image_gallery'],
        'isFeatured'       => (bool) $r['is_featured'],
        'isActive'         => (bool) $r['is_active'],
        'whatsappEnabled'  => (bool) $r['whatsapp_enabled'],
        'categoryId'       => $r['category_id'],
        'createdAt'        => $r['created_at'],
        'updatedAt'        => $r['updated_at'],
    ];
    if (isset($r['cat_id'])) {
        $p['category'] = [
            'id'          => $r['cat_id'],
            'name'        => $r['cat_name'],
            'slug'        => $r['cat_slug'],
            'description' => $r['cat_description'],
            'createdAt'   => $r['cat_created_at'],
            'updatedAt'   => $r['cat_updated_at'],
        ];
    }
    return $p;
}

function mapCategory(array $r): array {
    $c = [
        'id'          => $r['id'],
        'name'        => $r['name'],
        'slug'        => $r['slug'],
        'description' => $r['description'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
    if (isset($r['product_count'])) {
        $c['_count'] = ['products' => (int) $r['product_count']];
    }
    return $c;
}

function mapService(array $r): array {
    return [
        'id'          => $r['id'],
        'title'       => $r['title'],
        'slug'        => $r['slug'],
        'description' => $r['description'],
        'icon'        => $r['icon'],
        'isActive'    => (bool) $r['is_active'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
}

function mapBlog(array $r): array {
    return [
        'id'          => $r['id'],
        'title'       => $r['title'],
        'slug'        => $r['slug'],
        'excerpt'     => $r['excerpt'],
        'content'     => $r['content'],
        'coverImage'  => $r['cover_image'],
        'isPublished' => (bool) $r['is_published'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
}

function mapPage(array $r): array {
    return [
        'id'          => $r['id'],
        'title'       => $r['title'],
        'slug'        => $r['slug'],
        'excerpt'     => $r['excerpt'],
        'content'     => $r['content'],
        'isPublished' => (bool) $r['is_published'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
}

function mapSlide(array $r): array {
    $trust = [];
    if (!empty($r['trust'])) {
        $decoded = json_decode($r['trust'], true);
        if (is_array($decoded)) $trust = $decoded;
    }
    return [
        'id'          => $r['id'],
        'eyebrow'     => $r['eyebrow'],
        'title'       => $r['title'],
        'description' => $r['description'],
        'href'        => $r['href'],
        'cta'         => $r['cta'],
        'trust'       => $trust,
        'imageUrl'    => $r['image_url'],
        'videoUrl'    => $r['video_url'],
        'order'       => (int) $r['sort_order'],
        'isActive'    => (bool) $r['is_active'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
}

function mapReference(array $r): array {
    return [
        'id'        => $r['id'],
        'name'      => $r['name'],
        'logoUrl'   => $r['logo_url'],
        'website'   => $r['website'],
        'order'     => (int) $r['sort_order'],
        'isActive'  => (bool) $r['is_active'],
        'createdAt' => $r['created_at'],
        'updatedAt' => $r['updated_at'],
    ];
}

function mapMessage(array $r): array {
    return [
        'id'        => $r['id'],
        'name'      => $r['name'],
        'email'     => $r['email'],
        'phone'     => $r['phone'],
        'subject'   => $r['subject'],
        'message'   => $r['message'],
        'createdAt' => $r['created_at'],
    ];
}
