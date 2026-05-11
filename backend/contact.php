<?php
// app/api/contact/route.ts ve app/api/contact/[id]/route.ts → PHP_API_URL/contact.php
// contact_messages: id VARCHAR(32), name, email, phone, subject VARCHAR(500), message TEXT, created_at DATETIME
require_once __DIR__ . '/config.php';
cors();

$id = qid(); $m = method();

if ($m === 'GET') {
    requireAdmin();
    $stmt = db()->query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    ok(array_map('mapMessage', $stmt->fetchAll()));
}

if ($m === 'POST') {
    $b = body();
    foreach (['name','email','subject','message'] as $f) {
        if (empty($b[$f])) err("Alan zorunlu: $f");
    }
    if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) err('Geçersiz e-posta adresi.');
    $newId = cuid();
    db()->prepare("INSERT INTO contact_messages (id, name, email, phone, subject, message) VALUES (?,?,?,?,?,?)")
        ->execute([$newId, $b['name'], $b['email'], $b['phone'] ?? null, $b['subject'], $b['message']]);
    $stmt = db()->prepare('SELECT * FROM contact_messages WHERE id = ?');
    $stmt->execute([$newId]);
    ok(mapMessage($stmt->fetch()), 201);
}

if ($m === 'DELETE') {
    requireAdmin();
    if (!$id) err('id gerekli.');
    $stmt = db()->prepare('SELECT id FROM contact_messages WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) err('Mesaj bulunamadı.', 404);
    db()->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([$id]);
    ok(['success' => true]);
}

err('Method not allowed.', 405);
