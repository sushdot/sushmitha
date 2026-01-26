-- Step 1: Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'contractor', 'citizen');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if user is admin or staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'staff')
  )
$$;

-- Step 4: RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 5: Drop existing overly permissive policies and create secure ones

-- POTHOLES TABLE
DROP POLICY IF EXISTS "Anyone can report potholes" ON public.potholes;
DROP POLICY IF EXISTS "Anyone can update potholes" ON public.potholes;
DROP POLICY IF EXISTS "Anyone can view potholes" ON public.potholes;

-- Public can view potholes (transparency)
CREATE POLICY "Public can view potholes"
  ON public.potholes FOR SELECT
  USING (true);

-- Authenticated users can report potholes
CREATE POLICY "Authenticated users can report potholes"
  ON public.potholes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only admin/staff can update potholes
CREATE POLICY "Staff can update potholes"
  ON public.potholes FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

-- SUPPLIERS TABLE
DROP POLICY IF EXISTS "Anyone can add suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can view suppliers" ON public.suppliers;

-- Public can view suppliers (transparency)
CREATE POLICY "Public can view suppliers"
  ON public.suppliers FOR SELECT
  USING (true);

-- Only admin/staff can add suppliers
CREATE POLICY "Staff can add suppliers"
  ON public.suppliers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff(auth.uid()));

-- Only admin/staff can update suppliers
CREATE POLICY "Staff can update suppliers"
  ON public.suppliers FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

-- ALERTS TABLE
DROP POLICY IF EXISTS "Anyone can update alerts" ON public.alerts;
DROP POLICY IF EXISTS "Anyone can view alerts" ON public.alerts;
DROP POLICY IF EXISTS "System can create alerts" ON public.alerts;

-- Public can view alerts (transparency)
CREATE POLICY "Public can view alerts"
  ON public.alerts FOR SELECT
  USING (true);

-- Only admin/staff can create alerts
CREATE POLICY "Staff can create alerts"
  ON public.alerts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff(auth.uid()));

-- Only admin/staff can update alerts
CREATE POLICY "Staff can update alerts"
  ON public.alerts FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

-- CONTRACTOR_SCORES TABLE
DROP POLICY IF EXISTS "Anyone can update contractor scores" ON public.contractor_scores;
DROP POLICY IF EXISTS "Anyone can view contractor scores" ON public.contractor_scores;
DROP POLICY IF EXISTS "System can add contractor scores" ON public.contractor_scores;

-- Public can view contractor scores (transparency)
CREATE POLICY "Public can view contractor scores"
  ON public.contractor_scores FOR SELECT
  USING (true);

-- Only admin/staff can add contractor scores
CREATE POLICY "Staff can add contractor scores"
  ON public.contractor_scores FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff(auth.uid()));

-- Only admin/staff can update contractor scores
CREATE POLICY "Staff can update contractor scores"
  ON public.contractor_scores FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

-- SUPPLIER_SCORES TABLE
DROP POLICY IF EXISTS "Anyone can update supplier scores" ON public.supplier_scores;
DROP POLICY IF EXISTS "Anyone can view supplier scores" ON public.supplier_scores;
DROP POLICY IF EXISTS "System can add supplier scores" ON public.supplier_scores;

-- Public can view supplier scores (transparency)
CREATE POLICY "Public can view supplier scores"
  ON public.supplier_scores FOR SELECT
  USING (true);

-- Only admin/staff can add supplier scores
CREATE POLICY "Staff can add supplier scores"
  ON public.supplier_scores FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff(auth.uid()));

-- Only admin/staff can update supplier scores
CREATE POLICY "Staff can update supplier scores"
  ON public.supplier_scores FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));