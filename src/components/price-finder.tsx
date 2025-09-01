'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { findPricesAction } from '@/app/actions';
import type { Price } from '@/lib/types';
import { Loader2, Tag, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function PriceFinder({ gameName }: { gameName: string }) {
  const [prices, setPrices] = useState<Price[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFindPrices = async () => {
    setIsLoading(true);
    setPrices(null);
    try {
      const result = await findPricesAction(gameName);
      setPrices(result.prices);
      if (result.prices.length === 0) {
        toast({
          title: 'No prices found',
          description: `Our AI couldn't find any current prices for ${gameName}.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not fetch prices. Please try again later.',
      });
      setPrices([]); // To hide the loading state and show the 'not found' message if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="text-primary" />
          <span>Price Check</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Click the button below to use our AI to search for the best prices for this game across major retailers.
        </p>
        <Button onClick={handleFindPrices} disabled={isLoading} size="lg" className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Find Best Prices'
          )}
        </Button>

        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI is on the hunt...</p>
          </div>
        )}

        {prices && prices.length > 0 && (
          <div className="mt-6 animate-in fade-in-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Retailer</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((price, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{price.retailer}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{price.price}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <a href={price.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {prices && prices.length === 0 && (
          <div className="mt-6 text-center py-8 bg-muted/50 rounded-lg">
            <p className="font-semibold">No prices found</p>
            <p className="text-sm text-muted-foreground">Try again later or check your favorite stores directly.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
