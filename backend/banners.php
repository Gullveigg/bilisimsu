<?php
require_once __DIR__ . '/config.php';
cors();

$id = qid();
$m  = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM hero_slides WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) err('Banner bulunamadı.', 404);
        ok(mapSlide($row));
    }
    $stmt = db()->query('SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at ASC');
    ok(array_map('mapSlide', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['eyebrow','title','description','href','cta'] as $f) {
        if (empty($b[$f])) err("Alan zorunlu: $f");
    }
    $newId = cuid();
    $trust = json_encode(is_array($b['trust'] ?? null) ? $b['trust'] : []);
    db()->prepare("
        INSERT INTO hero_slides (id, eyebrow, title, description, href, cta, trust, image_url, video_url, sort_order, is_active)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([$newId, $b['eyebrow'], $b['title'], $b['description'], $b['href'], $b['cta'],
                 $trust, $b['imageUrl'] ?? null, $b['videoUrl'] ?? null,
                 (int)($b['order'] ?? 0), toBoolInt($b['isActive'] ?? true)]);
    $stmt = db()->prepare('SELECT * FROM hero_slides WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapSlide($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['eyebrow'=>'eyebrow','title'=>'title','description'=>'description',
              'href'=>'href','cta'=>'cta','imageUrl'=>'image_url','videoUrl'=>'video_url'] as $jk=>$col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (array_key_exists('trust', $b)) {
        $fields[] = '`trust` = ?';
        $vals[]   = json_encode(is_array($b['trust']) ? $b['trust'] : []);
    }
    if (array_key_exists('order', $b)) { $fields[] = '`sort_order` = ?'; $vals[] = (int)$b['order']; }
    if (array_key_exists('isActive', $b)) { $fields[] = '`is_active` = ?'; $vals[] = toBoolInt($b['isActive']); }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE hero_slides SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM hero_slides WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapSlide($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM hero_slides WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Banner bulunamadı.', 404);
    db()->prepare('DELETE FROM hero_slides WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
