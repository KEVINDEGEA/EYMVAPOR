<?php
// Recibe el formulario de index.html y lo envía por correo. Cambia $to por tu correo real del dominio.
header('Content-Type: application/json; charset=utf-8');

$to = 'ventas@eymvaporycontrol.pe';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Método no permitido.']);
    exit;
}

// Honeypot anti-spam: el campo "web" debe llegar vacío
if (!empty($_POST['web'])) {
    echo json_encode(['ok' => true, 'message' => 'Gracias.']);
    exit;
}

function clean($v) {
    return trim(str_replace(["\r", "\n"], ' ', strip_tags($v ?? '')));
}

$nombre   = clean($_POST['nombre'] ?? '');
$empresa  = clean($_POST['empresa'] ?? '');
$telefono = clean($_POST['telefono'] ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$servicio = clean($_POST['servicio'] ?? '');
$mensaje  = trim(strip_tags($_POST['mensaje'] ?? ''));

if ($nombre === '' || !$email || $mensaje === '') {
    echo json_encode(['ok' => false, 'message' => 'Completa nombre, correo válido y mensaje.']);
    exit;
}

$asunto = "Solicitud de cotización - $nombre ($empresa)";
$cuerpo = "Nombre: $nombre\nEmpresa: $empresa\nTeléfono: $telefono\nCorreo: $email\nServicio: $servicio\n\nMensaje:\n$mensaje\n";
$headers = "From: Web E&M Vapor <no-reply@eymvaporycontrol.pe>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($to, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, $headers);

echo json_encode([
    'ok' => $ok,
    'message' => $ok ? '¡Gracias! Recibimos tu solicitud y te responderemos pronto.' : 'No se pudo enviar el mensaje. Intenta por WhatsApp.'
]);
