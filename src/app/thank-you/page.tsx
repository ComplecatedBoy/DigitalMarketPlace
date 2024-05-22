import { getServerSideUser } from "@/lib/payload.utils";
import Image from "next/image";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/get.payload";
import { notFound, redirect } from "next/navigation";
import { Product, ProductFile, User } from "../../payload-types";
import { PRODUCT_CATERGORIES } from "@/config";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import PaymentStatus from "@/components/PaymentStatus";

interface PageProps {
  searchParams: {
    orderId: string | string[] | undefined;
  };
}
const ThankyouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;
  if (!order) return notFound();

  const orderUserId = typeof order.user === "string" ? user : user?.id;
  if (orderUserId != user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  const products = order.productsList as Product[];

  const orderTotal = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="Thank you for your order"
        />
      </div>
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 lx:gap-x-24 ">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for Ordering
            </h1>
            {order.isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                your oder are processed and your assests are availble to
                download below.we&#39;ve sent your reciept and order-details to{" "}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order,and we &#39;re currently processing
                it.So hang tight and we&#39;l send you confirmation very soon!.
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              <ul className="mt-6  divide-y divide-gray-200 border-t border-gray-200 text-sm">
                {(order.productsList as Product[]).map((product) => {
                  const label = PRODUCT_CATERGORIES.find(
                    (c) => c.value === product.category
                  )?.label;

                  const downloadUrl = (product.product_files as ProductFile)
                    .url as string;

                  const { image } = product.images[0];
                  return (
                    <li key={product.id} className="flex py-6 space-x-6">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt={`${product.id} image`}
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          />
                        ) : null}
                      </div>
                      <div className="flex-auto flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>
                          <p className="my-1">Category:{label}</p>
                        </div>
                        {order.isPaid ? (
                          <a
                            href={downloadUrl}
                            download={product.name}
                            className="text-blue-600 hover:underline underline-offset-2"
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>
                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{formatPrice(orderTotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(100)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 ">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(orderTotal + 100)}</p>
                </div>
              </div>

              <PaymentStatus
                isPaid={order.isPaid}
                orderEmail={(order.user as User).email}
                orderId={order.id}
              />

              <div className="mt-6 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankyouPage;
