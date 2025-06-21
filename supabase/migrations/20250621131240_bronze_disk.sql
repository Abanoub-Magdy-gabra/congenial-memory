/*
  # Fix RLS policies for sample data insertion

  1. Security Updates
    - Update RLS policies to allow anonymous users to read data
    - Allow anonymous users to insert sample data (categories and menu_items only)
    - Maintain security for other sensitive operations

  2. Changes
    - Modify categories table policies to allow anonymous read and insert
    - Modify menu_items table policies to allow anonymous read and insert
    - Keep other tables secure with authenticated-only access
*/

-- Drop existing policies for categories
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON categories;

-- Create new policies for categories
CREATE POLICY "Allow read access for everyone"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert for everyone"
  ON categories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated users"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Drop existing policies for menu_items
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON menu_items;

-- Create new policies for menu_items
CREATE POLICY "Allow read access for everyone"
  ON menu_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert for everyone"
  ON menu_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated users"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (true);