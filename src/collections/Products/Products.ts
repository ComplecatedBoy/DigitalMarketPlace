import { Product, User } from "../../payload-types";
import { PRODUCT_CATERGORIES } from "../../config";
import {
  CollectionAfterChangeHook,
  CollectionConfig,
  CollectionBeforeChangeHook,
  Access,
} from "payload/types";
import { stripe } from "../../lib/stripe";
const addUser: CollectionBeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id };
};
const syncUser: CollectionAfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });
  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product
      ) || []),
    ];

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    );

    const dataToUpdate = [...createdProductIDs, doc.id];

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    const userProductsIDs = (user.products || []).reduce<Array<String>>(
      (acc, product) => {
        if (!product) return acc;
        if (typeof product === "string") {
          acc.push(product);
        } else {
          acc.push(product.id);
        }
        return acc;
      },
      []
    );

    return {
      id: {
        in: userProductsIDs,
      },
    };
  };

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAdminOrHasAccess(),
  },
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {
          const data = args.data as Product;

          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "INR",
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            pricedId: createdProduct.default_price as string,
          };
          return updated;
        } else if (args.operation === "update") {
          const data = args.data as Product;

          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.pricedId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            pricedId: updatedProduct.default_price as string,
          };

          return updated;
        }
      },
    ],
    afterChange: [syncUser],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },
    {
      name: "price",
      type: "number",
      label: "Price in INR",
      min: 100,
      max: 10000,
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATERGORIES.map(({ label, value }) => ({
        label,
        value,
      })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      hasMany: false,
    },
    {
      name: "approvedForSale",
      label: "Product status",
      type: "select",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "pricedId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: false,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: false,
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
