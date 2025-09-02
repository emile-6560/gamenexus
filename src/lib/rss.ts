
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
      // IGN uses media:content or media:thumbnail for the main image
      const mediaContent = item['media:content'];
      const mediaThumbnail = item['media:thumbnail'];

      if (mediaContent && mediaContent[0] && mediaContent[0].$.url) {
        imageUrl = mediaContent[0].$.url;
      } else if (mediaThumbnail && mediaThumbnail[0] && mediaThumbnail[0].$.url) {
          imageUrl = mediaThumbnail[0].$.url;
      }
      
      const cleanCDATA = (str: string) => {
         if (typeof str === 'string') {
          return str.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim();
        }
        return '';
      }

      // Handle guid being a string or an object with _
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
