/**
 * recaptcha.gs — reCAPTCHA v3 トークンをサーバー側で検証
 *
 * Script Properties に RECAPTCHA_SECRET を設定しておくこと。
 * 検証成功時はスコア（0.0〜1.0）を返す。失敗時は null。
 */

function verifyRecaptcha(token) {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('RECAPTCHA_SECRET');
  if (!secret) {
    console.error('RECAPTCHA_SECRET is not set in Script Properties');
    return null;
  }

  const response = UrlFetchApp.fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'post',
      payload: {
        secret: secret,
        response: token,
      },
      muteHttpExceptions: true,
    }
  );

  const statusCode = response.getResponseCode();
  if (statusCode !== 200) {
    console.error('reCAPTCHA HTTP error:', statusCode, response.getContentText());
    return null;
  }

  try {
    const result = JSON.parse(response.getContentText());
    if (!result.success) {
      console.warn('reCAPTCHA not successful:', JSON.stringify(result));
      return null;
    }
    // v3 はスコアが必ず含まれるが、念の為デフォルト値を用意
    return typeof result.score === 'number' ? result.score : 0;
  } catch (err) {
    console.error('reCAPTCHA response parse error:', err);
    return null;
  }
}
