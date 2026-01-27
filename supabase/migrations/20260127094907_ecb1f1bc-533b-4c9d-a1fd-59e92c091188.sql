-- Fix #1: Restrict user_roles table - remove any public access
-- Only allow users to view their own roles, and admins to view all roles

-- Drop existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create strict policies that require authentication
-- Users can ONLY view their own roles (no anonymous access)
CREATE POLICY "Users can view own roles only"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all roles (authenticated only)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage (INSERT/UPDATE/DELETE) all roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix #2: Restrict suppliers table - sensitive business intelligence
-- Only authenticated staff/admin can view supplier details

-- Drop existing public access policy
DROP POLICY IF EXISTS "Public can view suppliers" ON public.suppliers;

-- Staff and admins can view all supplier data
CREATE POLICY "Staff can view suppliers"
  ON public.suppliers
  FOR SELECT
  TO authenticated
  USING (is_admin_or_staff(auth.uid()));