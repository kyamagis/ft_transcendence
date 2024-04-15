export function formatToJapaneseTime(timestamp: string) {
  // UTCのタイムスタンプをDateオブジェクトに変換
  const date = new Date(timestamp)

  // Intl.DateTimeFormatを使用して日本時間の24時間表記にフォーマット
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  })

  return formatter.format(date)
}
