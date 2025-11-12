import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { addProductToOrder } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // ---- Create User ----
  const user = await createUser({
    username: "scorpio_stargazer",
    password: "cosmicpassword123",
  });

  console.log("🔮 User created:", user.username);

  // ---- Create 10 Astrological Products ----
  const oracleCards = await createProduct({
    title: "Oracle Cards",
    description: "44-card oracle deck for intuitive guidance",
    price: 24.99,
  });

  const birthChartPrint = await createProduct({
    title: "Custom Birth Chart Print",
    description: "Personalized natal chart with optional foil printing",
    price: 44.0,
  });

  const crystalKit = await createProduct({
    title: "Crystal Healing Kit",
    description: "Rose quartz, amethyst, citrine, and clear quartz bundle",
    price: 32.5,
  });

  const moonLamp = await createProduct({
    title: "Moon Phase Lamp",
    description: "LED moon lamp with adjustable brightness",
    price: 39.99,
  });

  const astrologyJournal = await createProduct({
    title: "Astrology Manifestation Journal",
    description: "Guided prompts for moon rituals and manifestation",
    price: 17.99,
  });

  const sageBundle = await createProduct({
    title: "Sage & Palo Santo Cleansing Bundle",
    description: "Ethically sourced sage stick + palo santo",
    price: 12.5,
  });

  const zodiacMug = await createProduct({
    title: "Zodiac Sign Mug",
    description: "Ceramic mug with your zodiac constellation",
    price: 18.0,
  });

  const astrologyNecklace = await createProduct({
    title: "Zodiac Constellation Necklace",
    description: "14k gold-plated pendant featuring zodiac constellation",
    price: 29.99,
  });

  const meditationCandle = await createProduct({
    title: "Meditation Intention Candle",
    description: "Soy candle infused with lavender and moonstone chips",
    price: 22.0,
  });

  const starProjector = await createProduct({
    title: "Galaxy Star Projector",
    description: "Projects moving stars and nebula clouds in your room",
    price: 49.99,
  });

  console.log("✨ 10 astrology products created!");

  // ---- Create Order for This User ----
  const order = await createOrder({
    date: new Date(),
    note: "New Moon ritual haul",
    user_id: user.id,
  });

  console.log("🧾 Order created for user id:", user.id);

  // ---- Add At Least 5 Products to the Order ----
  await addProductToOrder({
    order_id: order.id,
    product_id: oracleCards.id,
    quantity: 1,
  });
  await addProductToOrder({
    order_id: order.id,
    product_id: crystalKit.id,
    quantity: 1,
  });
  await addProductToOrder({
    order_id: order.id,
    product_id: meditationCandle.id,
    quantity: 2,
  });
  await addProductToOrder({
    order_id: order.id,
    product_id: astrologyJournal.id,
    quantity: 1,
  });
  await addProductToOrder({
    order_id: order.id,
    product_id: zodiacMug.id,
    quantity: 1,
  });

  console.log("✅ Added 5 products to order:", order.id);
  console.log("🌟 Seed completed successfully!");
}
