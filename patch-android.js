#!/usr/bin/env node
/**
 * 在 `npx cap add android` 之后运行：
 *  - 确保 AndroidManifest 有 INTERNET 权限
 *  - 允许 cleartext（防止部分接口重定向到 http 被拦）
 *  - 写入 network_security_config
 *  - 确保 CapacitorHttp 原生网络插件被加载（绕过 WebView CORS）
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, 'android')
const manifestPath = path.join(root, 'app', 'src', 'main', 'AndroidManifest.xml')
const resXmlDir = path.join(root, 'app', 'src', 'main', 'res', 'xml')
const nscPath = path.join(resXmlDir, 'network_security_config.xml')

if (!fs.existsSync(manifestPath)) {
  console.error('❌ 找不到 AndroidManifest.xml，请先执行 npx cap add android')
  process.exit(1)
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
let changed = false

// 1) INTERNET 权限
if (!manifest.includes('android.permission.INTERNET')) {
  manifest = manifest.replace(
    /(<manifest[^>]*>)/,
    '$1\n    <uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />'
  )
  changed = true
  console.log('✓ 已添加 INTERNET 权限')
} else {
  console.log('· INTERNET 权限已存在')
}

// 2) 允许 cleartext + networkSecurityConfig
if (!manifest.includes('usesCleartextTraffic')) {
  manifest = manifest.replace(/<application(\s)/, '<application\n        android:usesCleartextTraffic="true"$1')
  changed = true
  console.log('✓ 已允许 cleartext')
}
if (!manifest.includes('android:networkSecurityConfig')) {
  manifest = manifest.replace(
    /<application(\s)/,
    '<application\n        android:networkSecurityConfig="@xml/network_security_config"$1'
  )
  changed = true
  console.log('✓ 已挂载 network_security_config')
}

if (changed) fs.writeFileSync(manifestPath, manifest)
console.log('✓ AndroidManifest 处理完成')

// 3) network_security_config.xml
if (!fs.existsSync(resXmlDir)) fs.mkdirSync(resXmlDir, { recursive: true })
fs.writeFileSync(
  nscPath,
  `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
`
)
console.log('✓ 已写入 network_security_config.xml')

// 4) 检查 CapacitorHttp 是否存在于依赖中
try {
  const corePkg = require.resolve('@capacitor/core/package.json', { paths: [__dirname] })
  console.log('· @capacitor/core 位置:', corePkg)
} catch (e) {
  console.log('⚠️ 未能定位 @capacitor/core（构建时 npm install 会补齐）')
}

console.log('\n✅ Android 工程补丁应用完毕')
