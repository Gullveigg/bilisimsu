<?php
require_once __DIR__ . '/config.php';
cors();

$id = qid(); $m = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM pages WHERE id = ? OR slug = ?');
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch();
        if (!$row) err('Sayfa bulunamadı.', 404);
        ok(mapPage($row));
    }
    $stmt = db()->query('SELECT * FROM pages ORDER BY created_at DESC');
    ok(array_map('mapPage', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['title','excerpt','content'] as $f) { if (empty($b[$f])) err("Alan zorunlu: $f"); }
    $newId = cuid();
    db()->prepare("INSERT INTO pages (id, title, slug, excerpt, content, is_published) VALUES (?,?,?,?,?,?)")
        ->execute([$newId, $b['title'], !empty($b['slug']) ? $b['slug'] : makeSlug($b['title']),
                   $b['excerpt'], $b['content'], boolVal($b['isPublished'] ?? true)]);
    $stmt = db()->prepare('SELECT * FROM pages WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapPage($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['title'=>'title','slug'=>'slug','excerpt'=>'excerpt','content'=>'content'] as $jk=>$col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (array_key_exists('isPublished', $b)) { $fields[] = '`is_published` = ?'; $vals[] = boolVal($b['isPublished']); }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE pages SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM pages WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapPage($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM pages WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Sayfa bulunamadı.', 404);
    db()->prepare('DELETE FROM pages WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
