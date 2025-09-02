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
      // IGN uses media:content for the main image
      if (item['media:content'] && item['media:content'][0] && item['media:content'][0].$.url) {
        imageUrl = item['media:content'][0].$.url;
      }
      
      // Simple function to clean CDATA wrappers if they exist
      const cleanCDATA = (str: string) => {
         if (typeof str === 'string') {
          // A more robust way to remove CDATA
          return str.replace('<![CDATA[', '').replace('', '').trim();
        }
        return '';
      }

      return {
        title: cleanCDATA(item.title[0]),
        link: item.link[0],
        description: cleanCDATA(item.description[0]),
        pubDate: item.pubDate[0],
        guid: item.guid[0]._,
        imageUrl: imageUrl,
        creator: item['dc:creator']?.[0] ?? 'IGN Staff',
      };
    });

  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
}
]]>