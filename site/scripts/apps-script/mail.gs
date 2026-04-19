/**
 * mail.gs — 管理者通知メール + 入力者への自動返信メールを送信
 *
 * Script Properties:
 *   ADMIN_EMAIL — 管理者宛先（例：a.takeda@4est.co.jp）
 *   BRAND_NAME  — 送信時の表示名（例：AI TAKEDA）
 *
 * 送信元は Web App を実行する Google アカウント（オーナー = s.takeda@4est.co.jp）。
 * 送信者名のみ BRAND_NAME で上書きする。
 */

function sendNotifyEmail(data, score) {
  const props = PropertiesService.getScriptProperties();
  const adminEmail = props.getProperty('ADMIN_EMAIL');
  const brandName = props.getProperty('BRAND_NAME') || 'AI TAKEDA';
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is not set in Script Properties');
  }

  const categoryLabel = getCategoryLabel(data.category);
  const jstNow = Utilities.formatDate(
    new Date(),
    'Asia/Tokyo',
    'yyyy年MM月dd日 HH:mm:ss'
  );

  const subject = '【新規お問い合わせ】' + categoryLabel + '｜' + data.name + ' 様';

  const body =
    '以下のお問い合わせを受け付けました。\n\n' +
    '─────────────────────────────\n' +
    'お名前：' + data.name + '\n' +
    'ご所属：' + data.company + '\n' +
    'メール：' + data.email + '\n' +
    'カテゴリ：' + categoryLabel + '\n\n' +
    'ご相談内容：\n' +
    data.message + '\n' +
    '─────────────────────────────\n\n' +
    '受信日時：' + jstNow;

  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    body: body,
    replyTo: data.email,
    name: brandName + ' Contact Form',
  });
}

function sendAutoReply(data) {
  const props = PropertiesService.getScriptProperties();
  const brandName = props.getProperty('BRAND_NAME') || 'AI TAKEDA';

  const categoryLabel = getCategoryLabel(data.category);
  const subject = 'お問い合わせありがとうございます｜' + brandName;

  // 冒頭の宛名：所属が入力されていれば「所属名＋改行＋お名前 様」
  const salutation = data.company
    ? data.company + '\n' + data.name + ' 様'
    : data.name + ' 様';

  const body =
    salutation + '\n\n' +
    brandName + 'へのお問い合わせ、誠にありがとうございます。\n' +
    '以下の内容で承りました。\n\n' +
    '─────────────────────────────\n' +
    'お名前：' + data.name + '\n' +
    'ご所属：' + data.company + '\n' +
    'カテゴリ：' + categoryLabel + '\n\n' +
    'ご相談内容：\n' +
    data.message + '\n' +
    '─────────────────────────────\n\n' +
    '内容確認のうえ、3営業日以内に担当よりご返信いたします。\n' +
    '今しばらくお待ちくださいませ。\n\n' +
    '──\n\n' +
    brandName + '\n' +
    'TAKEDA FORESTRY, Inc.\n\n' +
    '調香師 武田愛\n' +
    'IAPA認定アロマ調香デザイナー®︎\n\n' +
    '愛媛県喜多郡内子町五十崎乙673番地11';

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: brandName,
  });
}
