/*
  # Create property tables and schemas

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references users.id)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `location` (text)
      - `type` (text): apartment, house, land, commercial
      - `listing_type` (text): rent, sale
      - `rooms` (integer)
      - `bathrooms` (integer)
      - `area` (numeric)
      - `features` (text[])
      - `images` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `status` (text): active, inactive, sold, rented
      - `featured` (boolean)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for authenticated users to read all properties
    - Add policy for authenticated users to create their own properties
    - Add policy for owners to update and delete their own properties
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  listing_type text NOT NULL,
  rooms integer,
  bathrooms integer,
  area numeric,
  features text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  featured boolean DEFAULT false
);

-- Add type constraints
ALTER TABLE properties 
  ADD CONSTRAINT valid_property_type 
  CHECK (type IN ('apartment', 'house', 'land', 'commercial'));

ALTER TABLE properties 
  ADD CONSTRAINT valid_listing_type 
  CHECK (listing_type IN ('rent', 'sale'));

ALTER TABLE properties 
  ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'inactive', 'sold', 'rented'));

-- Create indexes
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Users can create their own properties" ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own properties" ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own properties" ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_properties_updated_at();