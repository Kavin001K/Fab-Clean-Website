import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to database");

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "stores" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" text NOT NULL,
        "name" text NOT NULL,
        "address" text NOT NULL,
        "phone" text NOT NULL,
        "email" text,
        "latitude" real NOT NULL,
        "longitude" real NOT NULL,
        "coverage_radius_km" real DEFAULT 3 NOT NULL,
        "map_href" text,
        "sort_order" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "stores_slug_unique" UNIQUE("slug")
      );

      INSERT INTO "stores" (
        "slug", "name", "address", "phone", "email", "latitude", "longitude", "coverage_radius_km", "map_href", "sort_order", "is_active"
      ) VALUES 
      (
        'pollachi', 'Pollachi Flagship', '#16, Venkatramana Round Road, Opposite Naturals Salon / HDFC Bank, Mahalingapuram, Pollachi - 642002', '93630 59595', 'info@myfabclean.in', 10.6559, 77.0090, 3.0, 'https://www.google.com/maps/search/?api=1&query=16%20Venkatramana%20Round%20Road%20Pollachi%20642002', 0, true
      ),
      (
        'kinathukadavu', 'Kinathukadavu Branch', '#442/11, Opposite MLA Office, Krishnasamypuram, Kinathukadavu - 642109', '93637 19595', 'myfabclean@gmail.com', 10.8219, 77.0210, 3.0, 'https://www.google.com/maps/search/?api=1&query=442%2F11%20Krishnasamypuram%20Kinathukadavu%20642109', 1, true
      ) ON CONFLICT DO NOTHING;
    `);
    console.log("Stores table created and seeded successfully.");
  } catch (error) {
    console.error("Error executing query", error);
  } finally {
    await client.end();
  }
}

main();
