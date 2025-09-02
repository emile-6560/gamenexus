'use server';

import { parseStringPromise } from 'xml2js';
import type { NewsArticle } from './types';

export async function getNewsFromRss(): Promise<NewsArticle[]> {
  const rssFeedUrl = 'https://www.ign.com/rss/articles/feed?tags=games';
  
  try {
    const response = await fetch(rssFeedUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const result = await parseStringPromise(xmlText);
    
    const items = result.rss.channel[0].item;
    
    return items.map((item: any): NewsArticle => {
      let imageUrl = '/placeholder.jpg';
      if (item['media:content'] && item['media:content'][0] && item['media:content'][0].$.url) {
        imageUrl = item['media:content'][0].$.url;
      }

      return {
        title: item.title[0].replace('<![CDATA[', '').replace('', '').trim(),
        link: item.link[0],
        description: item.description[0].replace('', '').replace('', '').trim(),
        pubDate: item.pubDate[0],
        guid: item.guid[0]._,
        imageUrl: imageUrl,
        creator: item['dc:creator'][0],
      };
    });

  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
}
]]>