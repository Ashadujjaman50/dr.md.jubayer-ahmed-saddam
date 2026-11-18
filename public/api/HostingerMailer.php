<?php
/**
 * HostingerMailer
 * 
 * Lightweight standalone SMTP SSL client for Hostinger (smtp.hostinger.com:465).
 * Does not require external packages or Composer.
 */

class HostingerMailer {
    private $host;
    private $port;
    private $username;
    private $password;
    private $timeout;

    public function __construct($host = 'smtp.hostinger.com', $port = 465, $username = '', $password = '', $timeout = 15) {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->timeout = $timeout;
    }

    /**
     * Send email via SMTP over SSL
     * 
     * @param string|array $to Single email or array of emails
     * @param string $subject Email subject
     * @param string $htmlBody HTML content
     * @param string $fromName Display name of sender
     * @param string $replyTo Optional reply-to address
     * @return array ['success' => bool, 'message' => string]
     */
    public function send($to, $subject, $htmlBody, $fromName = '', $replyTo = '') {
        $recipients = is_array($to) ? $to : array_filter(array_map('trim', explode(',', $to)));
        if (empty($recipients)) {
            return ['success' => false, 'message' => 'No recipients provided.'];
        }

        if (empty($this->username) || empty($this->password)) {
            return ['success' => false, 'message' => 'SMTP credentials are not configured.'];
        }

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false
            ]
        ]);

        $socket = @stream_socket_client(
            "ssl://{$this->host}:{$this->port}",
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$socket) {
            return ['success' => false, 'message' => "Could not connect to SMTP server: {$errstr} ({$errno})"];
        }

        stream_set_timeout($socket, $this->timeout);

        try {
            $this->expectCode($socket, 220);

            $this->sendCommand($socket, "EHLO " . (gethostname() ?: 'localhost'));
            $this->readMultiLine($socket, 250);

            $this->sendCommand($socket, "AUTH LOGIN");
            $this->expectCode($socket, 334);

            $this->sendCommand($socket, base64_encode($this->username));
            $this->expectCode($socket, 334);

            $this->sendCommand($socket, base64_encode($this->password));
            $this->expectCode($socket, 235);

            $this->sendCommand($socket, "MAIL FROM:<{$this->username}>");
            $this->expectCode($socket, 250);

            foreach ($recipients as $recipient) {
                $this->sendCommand($socket, "RCPT TO:<{$recipient}>");
                $this->expectCode($socket, 250);
            }

            $this->sendCommand($socket, "DATA");
            $this->expectCode($socket, 354);

            // Construct MIME headers
            $headers = [];
            $headers[] = "Date: " . date('r');
            $displayName = !empty($fromName) ? "=?UTF-8?B?" . base64_encode($fromName) . "?=" : $this->username;
            $headers[] = "From: {$displayName} <{$this->username}>";
            $headers[] = "To: " . implode(', ', $recipients);
            if (!empty($replyTo)) {
                $headers[] = "Reply-To: <{$replyTo}>";
            }
            $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "Content-Type: text/html; charset=UTF-8";
            $headers[] = "Content-Transfer-Encoding: base64";
            $headers[] = "X-Mailer: DrSaddam-Website-Mailer";

            // Base64 chunked body to guarantee zero corruption over SMTP
            $bodyData = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody)) . "\r\n.";
            $this->sendCommand($socket, $bodyData);
            $this->expectCode($socket, 250);

            $this->sendCommand($socket, "QUIT");
            @fclose($socket);

            return ['success' => true, 'message' => 'Email sent successfully.'];

        } catch (Exception $e) {
            @fclose($socket);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    private function sendCommand($socket, $cmd) {
        fwrite($socket, $cmd . "\r\n");
    }

    private function getResponse($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $response;
    }

    private function expectCode($socket, $expectedCode) {
        $response = $this->getResponse($socket);
        $code = (int)substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new Exception("SMTP Error: Expected {$expectedCode}, received: {$response}");
        }
        return $response;
    }

    private function readMultiLine($socket, $expectedCode) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 0, 3) == $expectedCode && substr($line, 3, 1) == ' ') {
                break;
            }
        }
        return $response;
    }
}
