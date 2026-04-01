# GA4 Analytics Dashboard

現代化深色風格 GA4 儀表板，使用 Next.js 14 + Tailwind CSS + Recharts。

## 功能

- 📊 KPI 卡片（用戶、工作階段、頁面瀏覽、跳出率）+ 趨勢對比
- ⚡ 即時在線用戶（每 30 秒自動刷新）
- 📈 流量趨勢折線圖
- 🍩 流量來源圓餅圖
- 📱 裝置分佈長條圖
- 📋 熱門頁面排行（可排序）
- 🗓 日期範圍選擇（預設 + 自訂）

## 本機啟動

```bash
# 安裝依賴
npm install

# 確認 .env.local 有這兩行
# GA4_PROPERTY_ID=518462706
# GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# 啟動開發伺服器
npm run dev
```

打開 http://localhost:3000

## 部署到 Vercel（免費）

1. 在 GitHub 建立新 repo，把這個資料夾 push 上去
   （注意：`service-account.json` 已在 .gitignore，不會上傳）

2. 到 [vercel.com](https://vercel.com) 登入，選 "Import Project"

3. **重要：在 Vercel 設定環境變數**
   - `GA4_PROPERTY_ID` = `518462706`
   - `GOOGLE_SERVICE_ACCOUNT_JSON` = 把 service-account.json 的內容整個貼上

4. 更新 `src/lib/ga4.ts`，改成從環境變數讀 JSON（見下方）

### Vercel 環境變數讀取方式

在 `src/lib/ga4.ts` 的 `getClient()` 改成：

```ts
function getClient() {
  // 本機：從檔案讀
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const resolvedPath = keyPath.startsWith("./")
      ? path.join(process.cwd(), keyPath)
      : keyPath;
    return new BetaAnalyticsDataClient({ keyFilename: resolvedPath });
  }
  
  // Vercel：從環境變數讀 JSON
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    return new BetaAnalyticsDataClient({ credentials });
  }
  
  throw new Error("No GA4 credentials configured");
}
```

## 資料夾結構

```
src/
  app/
    page.tsx              # 主儀表板頁面
    layout.tsx
    globals.css
    api/ga4/
      overview/route.ts
      realtime/route.ts
      trend/route.ts
      sources/route.ts
      pages/route.ts
      devices/route.ts
  components/
    DateRangePicker.tsx
    KpiCard.tsx
    RealtimeWidget.tsx
    TrendChart.tsx
    SourcesChart.tsx
    DevicesChart.tsx
    TopPagesTable.tsx
  lib/
    ga4.ts                # GA4 API 封裝
```
