"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      size="lg"
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      className="w-full "
    >
      {isSuccess ? "Added" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
