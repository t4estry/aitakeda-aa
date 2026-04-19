/**
 * sheet.gs — 問い合わせログ Google スプレッドシートへ1行追記
 *
 * Script Properties:
 *   SHEET_ID — スプレッドシート ID（URL の /d/XXXXX/edit の XXXXX 部分）
 *
 * 1行目はヘッダー（受信日時 / 名前 / 会社名 / メール / カテゴリ / 本文 / reCAPTCHA スコア）を想定。
 * 追記は appendRow() で1行ずつ確実に末尾に追加される（同時リクエストでも衝突しない）。
 */

function appendToSheet(data, score) {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) {
    throw new Error('SHEET_ID is not set in Script Properties');
  }

  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheets()[0]; // 最初のシート（通常は「シート1」）

  const categoryLabel = getCategoryLabel(data.category);

  sheet.appendRow([
    new Date(),          // A: 受信日時（Date オブジェクト、スプシ側でタイムゾーン適用）
    data.name,           // B: 名前
    data.company,        // C: 会社名
    data.email,          // D: メール
    categoryLabel,       // E: カテゴリ
    data.message,        // F: 本文
    score.toFixed(2),    // G: reCAPTCHA スコア（文字列で小数2桁）
  ]);
}
