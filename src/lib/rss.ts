
'use server';

import { parseStringPromise } from 'xml2js';
import type { NewsArticle } from './types';

export async function getNewsFromRss(): Promise<NewsArticle[]> {
  const rssFeedUrl = 'https://www.ign.com/rss/articles/feed?tags=games';
  
  try {
    const response = await fetch(rssFeedUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const result = await parseStringPromise(xmlText);
    
    const items = result.rss.channel[0].item;
    
    return items.map((item: any): NewsArticle => {
      let imageUrl = '/placeholder.jpg';
      const mediaContent = item['media:content'];
      if (mediaContent && mediaContent[0] && mediaContent[0].$.url) {
        imageUrl = mediaContent[0].$.url;
      } else {
        const mediaThumbnail = item['media:thumbnail'];
        if (mediaThumbnail && mediaThumbnail[0] && mediaThumbnail[0].$.url) {
          imageUrl = mediaThumbnail[0].$.url;
        }
      }
      
      const cleanCDATA = (str: string) => {
         if (typeof str === 'string') {
          return str.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();
        }
        return '';
      }

      const guid = typeof item.guid[0] === 'string' ? item.guid[0] : item.guid[0]._;

      return {
        title: cleanCDATA(item.title[0]),
        link: item.link[0],
        description: cleanCDATA(item.description[0]),
        pubDate: item.pubDate[0],
        guid: guid,
        imageUrl: imageUrl,
        creator: item['dc:creator']?.[0] ?? 'IGN Staff',
      };
    });

  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
}
