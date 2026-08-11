# 阪大バス

大阪大学の学内連絡バス（豊中・箕面・吹田）を、乗換案内のように検索するためのWebアプリです。

## MVP

- 今から乗れる次便
- 豊中 / 箕面 / 吹田のキャンパス単位検索
- 出発時刻・到着時刻指定
- 直行優先（豊中 ↔ 吹田で箕面非停車便を優先）
- 片道 / 往復検索
- ブラウザ現在地からキャンパス候補を推定
- 過去の検索頻度を端末内に保存し、次の行き先候補に利用
- 2026年度の土日祝・大学指定運休日を考慮
- 添付されたHaru UIデザイン参照に沿った、控えめで情報密度の高いUI

## Data

`src/data/2026/timetable.json` に大阪大学公式の2026年度時刻表79便を正規化して収録しています。

- 大阪大学 学内連絡バス: https://www.osaka-u.ac.jp/ja/access/bus
- 大阪大学 学内連絡バスの運休日: https://www.osaka-u.ac.jp/ja/access/files/2026bus/HP_r8bus_unkyuu.pdf/@@download/file
- 内閣府 国民の祝日: https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html

時刻表はリアルタイム運行情報ではありません。気象・道路状況による遅延や運休は大阪大学の案内、KOAN、阪急バス等で確認してください。

## Local development

Node.js 20.9以降を想定しています。

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Checks

```bash
npm run check
```

`npm run check` は型検査、ドメインテスト、production buildを実行します。

## API

```text
GET /api/routes?from=TOYONAKA&to=SUITA&date=2026-10-01&time=09:10&mode=departure&preference=direct
```

`mode` は `departure | arrival`、`preference` は `soonest | direct` です。

## Notes

- GPS座標はサーバーへ送信せず、ブラウザ内で最寄りキャンパス判定にのみ利用します。
- 検索履歴も `localStorage` にのみ保存します。
- いちょう祭の特別ダイヤは通常ダイヤと別扱いで、MVPには未収録です。
