<?php
// app/api/references/route.ts → PHP_API_URL/references.php
// ref_items tablosu: id, name, logo_url, website, sort_order INT, is_active TINYINT, created_at DATETIME
require_once __DIR__ . '/config.php';
cors();

$id = qid(); $m = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM ref_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) err('Referans bulunamadı.', 404);
        ok(mapReference($row));
    }
    $stmt = db()->query('SELECT * FROM ref_items ORDER BY sort_order ASC, created_at ASC');
    ok(array_map('mapReference', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['name','logoUrl'] as $f) { if (empty($b[$f])) err("Alan zorunlu: $f"); }
    $newId = cuid();
    db()->prepare("INSERT INTO ref_items (id, name, logo_url, website, sort_order, is_active) VALUES (?,?,?,?,?,?)")
        ->execute([$newId, $b['name'], $b['logoUrl'], $b['website'] ?? null,
                   (int)($b['order'] ?? 0), boolVal($b['isActive'] ?? true)]);
    $stmt = db()->prepare('SELECT * FROM ref_items WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapReference($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['name'=>'name','logoUrl'=>'logo_url','website'=>'website'] as $jk=>$col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (array_key_exists('order', $b)) { $fields[] = '`sort_order` = ?'; $vals[] = (int)$b['order']; }
    if (array_key_exists('isActive', $b)) { $fields[] = '`is_active` = ?'; $vals[] = boolVal($b['isActive']); }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE ref_items SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM ref_items WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapReference($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM ref_items WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Referans bulunamadı.', 404);
    db()->prepare('DELETE FROM ref_items WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
