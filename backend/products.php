<?php
require_once __DIR__ . '/config.php';
cors();

$id = qid();
$m  = method();

$joinSql = "
    SELECT p.*,
           c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
           c.description AS cat_description,
           c.created_at AS cat_created_at, c.updated_at AS cat_updated_at
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id
";

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare($joinSql . ' WHERE p.id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) err('Ürün bulunamadı.', 404);
        ok(mapProduct($row));
    }
    $stmt = db()->query($joinSql . ' ORDER BY p.created_at DESC');
    ok(array_map('mapProduct', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['name','shortDescription','description','technicalSpecs','imageUrl','categoryId'] as $f) {
        if (empty($b[$f])) err("Alan zorunlu: $f");
    }
    $newId   = cuid();
    $gallery = json_encode(is_array($b['imageGallery'] ?? null) ? $b['imageGallery'] : []);
    db()->prepare("
        INSERT INTO products
          (id, name, slug, short_description, description, technical_specs,
           price, image_url, image_gallery, is_featured, is_active, whatsapp_enabled, category_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $newId, $b['name'],
        !empty($b['slug']) ? $b['slug'] : makeSlug($b['name']),
        $b['shortDescription'], $b['description'], $b['technicalSpecs'],
        $b['price'] ?? null, $b['imageUrl'], $gallery,
        boolVal($b['isFeatured']     ?? false),
        boolVal($b['isActive']       ?? true),
        boolVal($b['whatsappEnabled'] ?? true),
        $b['categoryId'],
    ]);
    $stmt = db()->prepare($joinSql . ' WHERE p.id = ?');
    $stmt->execute([$newId]);
    ok(mapProduct($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b      = body();
    $fields = [];
    $vals   = [];
    $strMap = [
        'name'             => 'name',
        'slug'             => 'slug',
        'shortDescription' => 'short_description',
        'description'      => 'description',
        'technicalSpecs'   => 'technical_specs',
        'price'            => 'price',
        'imageUrl'         => 'image_url',
        'categoryId'       => 'category_id',
    ];
    foreach ($strMap as $jk => $col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    foreach (['isFeatured'=>'is_featured','isActive'=>'is_active','whatsappEnabled'=>'whatsapp_enabled'] as $jk => $col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = boolVal($b[$jk]); }
    }
    if (array_key_exists('imageGallery', $b)) {
        $fields[] = '`image_gallery` = ?';
        $vals[]   = json_encode(is_array($b['imageGallery']) ? $b['imageGallery'] : []);
    }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare($joinSql . ' WHERE p.id = ?');
    $stmt->execute([$id]);
    ok(mapProduct($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM products WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Ürün bulunamadı.', 404);
    db()->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
