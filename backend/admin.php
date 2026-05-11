<?php
require_once __DIR__ . '/config.php';
cors();

$action = $_GET['action'] ?? '';
$m      = method();

if ($m === 'POST' && $action === 'login') {
    $b = body();
    if (empty($b['email']) || empty($b['password'])) err('E-posta ve şifre zorunludur.');
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$b['email']]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($b['password'], $user['password_hash'])) {
        err('E-posta veya şifre hatalı.', 401);
    }
    ok(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']]);
}

if ($m === 'POST' && $action === 'logout') {
    ok(['success' => true]);
}

if ($m === 'GET' && $action === 'verify') {
    requireAdmin();
    ok(['ok' => true]);
}

err('Geçersiz istek.', 400);
