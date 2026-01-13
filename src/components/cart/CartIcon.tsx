'use client'
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const CartIcon = () => {
  const { getTotalItems } = {getTotalItems: ()=>0};
  const itemCount = getTotalItems();

  return (
    <Button variant="ghost" size="sm" className="relative" asChild>
      <Link href="/carrinho" aria-label={`Carrinho com ${itemCount} itens`}>
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default CartIcon;