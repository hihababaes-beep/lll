const fs = require('fs');
const path = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(path, 'utf8');

// ---------- 1) الأذونات ----------
const perms = [
  'ACCESS_FINE_LOCATION',
  'ACCESS_COARSE_LOCATION',
  'RECORD_AUDIO',          // الميكروفون
  'MODIFY_AUDIO_SETTINGS',
  'USE_BIOMETRIC',         // البصمة / الوجه
  'USE_FINGERPRINT'
];
const permXml = perms
  .filter(p => !xml.includes('android.permission.' + p))
  .map(p => `    <uses-permission android:name="android.permission.${p}" />`)
  .join('\n');

// مطلوب في أندرويد 11+ حتى يرى التطبيق خدمة التعرف على الكلام
const queriesXml = `    <queries>
        <intent>
            <action android:name="android.speech.RecognitionService" />
        </intent>
    </queries>`;

xml = xml.replace('</manifest>', `${permXml}\n${queriesXml}\n</manifest>`);

// ---------- 2) منع إعادة تحميل التطبيق عند الرجوع إليه ----------
function setAttr(tag, name, value) {
  const re = new RegExp(`android:${name}="[^"]*"`);
  return re.test(tag)
    ? tag.replace(re, `android:${name}="${value}"`)
    : `${tag} android:${name}="${value}"`;
}

{
  const nameIdx = xml.indexOf('.MainActivity');
  const tagStart = xml.lastIndexOf('<activity', nameIdx);
  const tagEnd = xml.indexOf('>', nameIdx);
  let tag = xml.slice(tagStart, tagEnd);

  tag = setAttr(tag, 'launchMode', 'singleTask');
  tag = setAttr(tag, 'alwaysRetainTaskState', 'true');
  tag = setAttr(
    tag,
    'configChanges',
    'orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|screenLayout|uiMode|locale|layoutDirection|fontScale|density|navigation'
  );

  xml = xml.slice(0, tagStart) + tag + xml.slice(tagEnd);
}

// ---------- 3) intents الخرائط والملاحة (كما كانت) ----------
const navIntents = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="geo" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:scheme="google.navigation" />
            </intent-filter>
        </activity>`;

const mainActivityIdx = xml.indexOf('.MainActivity');
const closeIdx = xml.indexOf('</activity>', mainActivityIdx);
xml = xml.slice(0, closeIdx) + navIntents + xml.slice(closeIdx + '</activity>'.length);

fs.writeFileSync(path, xml);
console.log('AndroidManifest patched.');
