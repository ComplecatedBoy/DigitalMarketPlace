"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";

const Cart = () => {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = items.length;

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);
  let fee = process.env.TRANSANCTION_FEE || "100";

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 text-gray-400 group-hover:text-gray-400"
        />
        <span className="sm ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea className="w-full max-h-96 pe-4 rounded-lg">
                {items.map(({ product }) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="flex">
                <span className="flex-1">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex">
                <span className="flex-1">Transaction Fee</span>
                <span>{formatPrice(Number(fee))}</span>
              </div>
              <div className="flex">
                <span className="flex-1">Total</span>
                <span>{formatPrice(cartTotal + Number(fee))}</span>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    {" "}
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              ></Image>
            </div>
            <div className="text-xl font-semibold">Your cart is Empty</div>
            <Link
              href="/products"
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-sm text-muted-foreground",
              })}
            >
              Add Items to your cart to checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
