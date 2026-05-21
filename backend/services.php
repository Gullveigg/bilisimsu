<?php
require_once __DIR__ . '/config.php';
cors();

$id = qid();
$m  = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM services WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) err('Hizmet bulunamadı.', 404);
        ok(mapService($row));
    }
    $stmt = db()->query('SELECT * FROM services ORDER BY created_at ASC');
    ok(array_map('mapService', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['title','description','icon'] as $f) {
        if (empty($b[$f])) err("Alan zorunlu: $f");
    }
    $newId = cuid();
    db()->prepare("INSERT INTO services (id, title, slug, description, icon, is_active) VALUES (?,?,?,?,?,?)")
        ->execute([$newId, $b['title'], !empty($b['slug']) ? $b['slug'] : makeSlug($b['title']),
                   $b['description'], $b['icon'], toBoolInt($b['isActive'] ?? true)]);
    $stmt = db()->prepare('SELECT * FROM services WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapService($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['title'=>'title','slug'=>'slug','description'=>'description','icon'=>'icon'] as $jk=>$col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (array_key_exists('isActive', $b)) { $fields[] = '`is_active` = ?'; $vals[] = toBoolInt($b['isActive']); }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE services SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM services WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapService($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM services WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Hizmet bulunamadı.', 404);
    db()->prepare('DELETE FROM services WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
