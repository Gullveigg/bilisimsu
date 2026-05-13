<?php
require_once __DIR__ . '/config.php';
cors();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = trim($_POST['name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$name || !$email || !$password) {
        $error = 'Tüm alanları doldurun.';
    } else {
        try {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $id   = 'u' . bin2hex(random_bytes(12));
            $stmt = db()->prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$id, $name, $email, $hash, 'admin']);
            $success = "Kullanıcı eklendi! Email: $email";
        } catch (Exception $e) {
            $error = 'Hata: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Admin Ekle</title>
<style>
  body { font-family: sans-serif; max-width: 400px; margin: 60px auto; padding: 20px; }
  input { width: 100%; padding: 8px; margin: 6px 0 14px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
  button { background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px; }
  .success { color: green; background: #f0fff4; padding: 10px; border-radius: 4px; margin-bottom: 16px; }
  .error   { color: red;   background: #fff0f0; padding: 10px; border-radius: 4px; margin-bottom: 16px; }
</style>
</head>
<body>
<h2>Admin Kullanıcı Ekle</h2>
<?php if (!empty($success)) echo "<div class='success'>$success</div>"; ?>
<?php if (!empty($error))   echo "<div class='error'>$error</div>"; ?>
<form method="POST">
  <label>Ad Soyad</label>
  <input type="text" name="name" required>
  <label>E-posta</label>
  <input type="email" name="email" required>
  <label>Şifre</label>
  <input type="password" name="password" required>
  <button type="submit">Ekle</button>
</form>
<p style="color:#999;font-size:12px;margin-top:30px;">İşiniz bitince bu dosyayı sunucudan silin.</p>
</body>
</html>
