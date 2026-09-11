import { NextResponse } from 'next/server';
import { MARKET_NEWS } from '@/lib/mockData';

export async function GET() {
  try {
    const res = await fetch(
      'https://news.google.com/rss/search?q=financial+markets+stock+fed+crypto&hl=en-US&gl=US&ceid=US:en',
      { cache: 'no-store' }
    );
    if (res.ok) {
      const xml = await res.text();
      // Simple regex extraction for RSS items
      const items: any[] = [];
      const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<source.*?>(.*?)<\/source>/g;
      let match;
      let count = 0;
      while ((match = itemRegex.exec(xml)) !== null && count < 6) {
        const rawTitle = match[1].replace('<![CDATA[', '').replace(']]>', '').trim();
        const link = match[2].trim();
        const pubDate = new Date(match[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const source = match[4].replace('<![CDATA[', '').replace(']]>', '').trim() || 'Financial Wire';

        let category = 'Market Update';
        if (rawTitle.toLowerCase().includes('fed') || rawTitle.toLowerCase().includes('rate')) category = 'Macro / Fed';
        if (rawTitle.toLowerCase().includes('bitcoin') || rawTitle.toLowerCase().includes('crypto')) category = 'Crypto';
        if (rawTitle.toLowerCase().includes('stock') || rawTitle.toLowerCase().includes('s&p')) category = 'Equities';
        if (rawTitle.toLowerCase().includes('oil') || rawTitle.toLowerCase().includes('gold')) category = 'Commodities';

        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        if (rawTitle.toLowerCase().includes('rally') || rawTitle.toLowerCase().includes('surge') || rawTitle.toLowerCase().includes('gain')) sentiment = 'Bullish';
        if (rawTitle.toLowerCase().includes('drop') || rawTitle.toLowerCase().includes('fall') || rawTitle.toLowerCase().includes('risk')) sentiment = 'Bearish';

        items.push({
          id: `live-news-${count}`,
          title: rawTitle,
          source,
          time: pubDate,
          url: link,
          category,
          sentiment
        });
        count++;
      }

      if (items.length > 0) {
        return NextResponse.json({ status: 'ok', news: items });
      }
    }
  } catch (e) {
    console.error('News RSS fetch warning:', e);
  }

  return NextResponse.json({ status: 'ok', news: MARKET_NEWS });
}
