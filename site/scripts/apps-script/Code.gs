/**
 * Code.gs — AI TAKEDA 特設サイト Contact フォーム backend
 * Web App として公開され、doPost() でフォーム送信を受信する。
 *
 * 処理フロー:
 *   1. JSON パース
 *   2. honeypot（website フィールド）チェック — bot 判定
 *   3. 必須フィールド検証
 *   4. reCAPTCHA v3 トークン検証（スコア < 0.5 は拒否）
 *   5. 管理者通知メール送信（a.takeda@4est.co.jp 宛、Reply-To: 入力者）
 *   6. 入力者への自動返信メール送信
 *   7. スプレッドシートに1行追記
 *   8. JSON レスポンス返却
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'no_body' });
    }

    const data = JSON.parse(e.postData.contents);

    // Honeypot — bot は大抵すべてのフィールドを埋めるため、hidden の website が入っていたら bot 判定
    if (data.website && String(data.website).trim() !== '') {
      console.warn('honeypot triggered:', data.website);
      return jsonResponse({ ok: true, note: 'accepted' }); // bot にはエラーを返さず静かに握り潰す
    }

    // 必須フィールド検証
    const required = ['name', 'company', 'email', 'category', 'message', 'recaptchaToken'];
    for (const f of required) {
      if (!data[f] || String(data[f]).trim() === '') {
        return jsonResponse({ ok: false, error: 'missing_field', field: f });
      }
    }

    // メール形式の軽い検証
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return jsonResponse({ ok: false, error: 'invalid_email' });
    }

    // 本文の長さ制限（上限 5000 文字）
    if (String(data.message).length > 5000) {
      return jsonResponse({ ok: false, error: 'message_too_long' });
    }

    // reCAPTCHA v3 検証
    const score = verifyRecaptcha(data.recaptchaToken);
    if (score === null) {
      return jsonResponse({ ok: false, error: 'recaptcha_verify_failed' });
    }
    if (score < 0.5) {
      console.warn('low reCAPTCHA score:', score);
      return jsonResponse({ ok: false, error: 'recaptcha_low_score', score: score });
    }

    // メール送信（失敗してもログ記録は試みる）
    try {
      sendNotifyEmail(data, score);
      sendAutoReply(data);
    } catch (mailErr) {
      console.error('mail send failed:', mailErr);
      return jsonResponse({ ok: false, error: 'mail_send_failed', message: String(mailErr) });
    }

    // スプレッドシート記録（失敗してもメール送信済みなので ok を返す）
    try {
      appendToSheet(data, score);
    } catch (sheetErr) {
      console.error('sheet append failed:', sheetErr);
      // メールは送れているので成功扱い
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('unhandled error:', err, err.stack);
    return jsonResponse({ ok: false, error: 'server_error', message: String(err) });
  }
}

/**
 * GET で叩かれたら軽いヘルスチェックを返す（デプロイ確認用）
 */
function doGet() {
  return jsonResponse({ ok: true, service: 'AI TAKEDA Contact', version: '1.0.0' });
}

/**
 * JSON レスポンス生成ヘルパー
 * Apps Script は HTTP ステータスを制御できないため、全て 200 で ok フィールドに成否を載せる
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * カテゴリ値 → 日本語ラベル変換（フォームの radio value を日本語表記に）
 */
function getCategoryLabel(value) {
  const map = {
    space: '空間香（法人）',
    product: '商品開発',
    lecture: '講演・執筆',
    other: 'その他',
  };
  return map[value] || value;
}
