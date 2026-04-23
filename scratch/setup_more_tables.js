const pg = require('pg');

const DATABASE_URL = 'postgresql://postgres.pxhydxsqtqpewmjfhhoh:badxit-mewjyw-kaDga9@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const sql = `
-- Enums for Pickups
DO $$ BEGIN
    CREATE TYPE "time_slot" AS ENUM('morning', 'afternoon', 'evening');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "pickup_status" AS ENUM('pending', 'confirmed', 'picked_up', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Stores Table
CREATE TABLE IF NOT EXISTS "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
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
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Pickups Table
CREATE TABLE IF NOT EXISTS "pickups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid,
	"booking_reference" text NOT NULL UNIQUE,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"address" text NOT NULL,
	"address_lat" real,
	"address_lng" real,
	"services" text[] NOT NULL,
	"special_instructions" text,
	"preferred_date" text NOT NULL,
	"time_slot" "time_slot" NOT NULL,
	"branch" text NOT NULL,
	"status" "pickup_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert a default store if none exist
INSERT INTO "stores" ("slug", "name", "address", "phone", "latitude", "longitude", "map_href")
SELECT 'main-branch', 'Fab Clean Main', 'Pollachi, Tamil Nadu', '8825702072', 10.662, 77.006, 'https://maps.google.com'
WHERE NOT EXISTS (SELECT 1 FROM "stores");
`;

async function setup() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(sql);
    console.log('Tables and types created successfully');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

setup();
