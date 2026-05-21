<?php
// Çağıran: app/api/blog/route.ts → PHP_API_URL/blog.php
// Tablo: blog_posts — id VARCHAR(32), title, slug, excerpt TEXT, content LONGTEXT,
//        cover_image VARCHAR(1000), is_published TINYINT(1), created_at DATETIME
// Kullanıcı talebi: "bütün endpointler çalışmalı her şeyi veritabanına kaydetmeli"
require_once __DIR__ . '/config.php';
cors();

$id = qid();
$m  = method();

if ($m === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM blog_posts WHERE id = ? OR slug = ?');
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch();
        if (!$row) err('Blog yazısı bulunamadı.', 404);
        ok(mapBlog($row));
    }
    $stmt = db()->query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    ok(array_map('mapBlog', $stmt->fetchAll()));
}

if ($m === 'POST') {
    requireAdmin();
    $b = body();
    foreach (['title','excerpt','content','coverImage'] as $f) {
        if (empty($b[$f])) err("Alan zorunlu: $f");
    }
    $newId = cuid();
    db()->prepare("INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, is_published) VALUES (?,?,?,?,?,?,?)")
        ->execute([$newId, $b['title'], !empty($b['slug']) ? $b['slug'] : makeSlug($b['title']),
                   $b['excerpt'], $b['content'], $b['coverImage'], toBoolInt($b['isPublished'] ?? true)]);
    $stmt = db()->prepare('SELECT * FROM blog_posts WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapBlog($stmt->fetch()), 201);
}

if ($m === 'PATCH') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $b = body(); $fields = []; $vals = [];
    foreach (['title'=>'title','slug'=>'slug','excerpt'=>'excerpt','content'=>'content','coverImage'=>'cover_image'] as $jk=>$col) {
        if (array_key_exists($jk, $b)) { $fields[] = "`$col` = ?"; $vals[] = $b[$jk]; }
    }
    if (array_key_exists('isPublished', $b)) { $fields[] = '`is_published` = ?'; $vals[] = toBoolInt($b['isPublished']); }
    if (empty($fields)) err('Güncellenecek alan yok.');
    $vals[] = $id;
    db()->prepare('UPDATE blog_posts SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    $stmt = db()->prepare('SELECT * FROM blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    ok(mapBlog($stmt->fetch()));
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Blog yazısı bulunamadı.', 404);
    db()->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
