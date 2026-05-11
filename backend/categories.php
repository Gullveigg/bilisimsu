<?php
require_once __DIR__ . '/config.php';
cors();

$id = qid();
$m  = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) err('Kategori bulunamadı.', 404);
        ok(mapCategory($row));
    }
    $stmt = db()->query("
        SELECT c.*, COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
    ");
    ok(array_map('mapCategory', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    if (empty($b['name'])) err('name zorunlu.');
    $newId = cuid();
    db()->prepare("INSERT INTO categories (id, name, slug, description) VALUES (?,?,?,?)")
        ->execute([$newId, $b['name'], !empty($b['slug']) ? $b['slug'] : makeSlug($b['name']), $b['description'] ?? null]);
    $stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapCategory($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['name'=>'name','slug'=>'slug','description'=>'description'] as $jk => $col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapCategory($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Kategori bulunamadı.', 404);
    db()->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
