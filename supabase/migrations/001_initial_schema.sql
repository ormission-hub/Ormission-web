-- ============================================================
-- ORMISSION EdTech Platform — Initial Database Schema
-- Supabase PostgreSQL
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   VARCHAR(255),
  phone       VARCHAR(20),
  avatar_url  TEXT,
  role        VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin', 'instructor')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  name_bn         VARCHAR(255),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  image_url       TEXT,
  icon_name       VARCHAR(100),
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title       VARCHAR(255),
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. SUBCATEGORIES
-- ============================================================
CREATE TABLE public.subcategories (
  id              SERIAL PRIMARY KEY,
  category_id     INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  name_bn         VARCHAR(255),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  image_url       TEXT,
  icon_name       VARCHAR(100),
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subcategories_category ON public.subcategories(category_id);

-- ============================================================
-- 4. INSTRUCTORS
-- ============================================================
CREATE TABLE public.instructors (
  id              SERIAL PRIMARY KEY,
  profile_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name            VARCHAR(255) NOT NULL,
  name_bn         VARCHAR(255),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  designation     VARCHAR(255),
  institution     VARCHAR(255),
  bio             TEXT,
  photo_url       TEXT,
  credentials     TEXT,
  website_url     TEXT,
  facebook_url    TEXT,
  linkedin_url    TEXT,
  youtube_url     TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title       VARCHAR(255),
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. COURSES
-- ============================================================
CREATE TABLE public.courses (
  id                  SERIAL PRIMARY KEY,
  slug                VARCHAR(255) UNIQUE NOT NULL,
  title               VARCHAR(500) NOT NULL,
  title_bn            VARCHAR(500),
  short_description   TEXT,
  description         TEXT,
  thumbnail_url       TEXT,
  category_id         INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id      INTEGER REFERENCES public.subcategories(id) ON DELETE SET NULL,
  instructor_id       INTEGER REFERENCES public.instructors(id) ON DELETE SET NULL,
  price               NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price      NUMERIC(10,2),
  is_free             BOOLEAN NOT NULL DEFAULT FALSE,
  language            VARCHAR(20) NOT NULL DEFAULT 'bn' CHECK (language IN ('bn', 'en', 'mixed')),
  course_type         VARCHAR(20) NOT NULL DEFAULT 'recorded' CHECK (course_type IN ('recorded', 'live', 'hybrid')),
  access_type         VARCHAR(20) NOT NULL DEFAULT 'lifetime' CHECK (access_type IN ('lifetime', 'limited', 'subscription')),
  access_duration_days INTEGER,
  total_lessons       INTEGER NOT NULL DEFAULT 0,
  total_duration      INTEGER NOT NULL DEFAULT 0,  -- in minutes
  enrollment_count    INTEGER NOT NULL DEFAULT 0,
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
  status              VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished', 'archived')),
  learning_outcomes   JSONB DEFAULT '[]'::jsonb,
  requirements        JSONB DEFAULT '[]'::jsonb,
  features            JSONB DEFAULT '[]'::jsonb,
  faq                 JSONB DEFAULT '[]'::jsonb,
  seo_title           VARCHAR(255),
  seo_description     TEXT,
  og_image_url        TEXT,
  published_at        TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_subcategory ON public.courses(subcategory_id);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_featured ON public.courses(is_featured) WHERE is_featured = TRUE;

-- ============================================================
-- 6. COURSE SECTIONS
-- ============================================================
CREATE TABLE public.course_sections (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       VARCHAR(500) NOT NULL,
  title_bn    VARCHAR(500),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_course_sections_course ON public.course_sections(course_id);

-- ============================================================
-- 7. LESSONS
-- ============================================================
CREATE TABLE public.lessons (
  id              SERIAL PRIMARY KEY,
  course_id       INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  section_id      INTEGER NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  title_bn        VARCHAR(500),
  type            VARCHAR(20) NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'pdf', 'text')),
  video_url       TEXT,
  video_provider  VARCHAR(50),  -- 'bunny', 'cloudflare', 'youtube'
  video_duration  INTEGER DEFAULT 0,  -- in minutes
  content         TEXT,
  is_preview      BOOLEAN NOT NULL DEFAULT FALSE,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_section ON public.lessons(section_id);

-- ============================================================
-- 8. LESSON RESOURCES
-- ============================================================
CREATE TABLE public.lesson_resources (
  id          SERIAL PRIMARY KEY,
  lesson_id   INTEGER NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   VARCHAR(20) CHECK (file_type IN ('pdf', 'doc', 'image', 'link', 'other')),
  file_size   INTEGER,  -- bytes
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lesson_resources_lesson ON public.lesson_resources(lesson_id);

-- ============================================================
-- 9. ENROLLMENTS
-- ============================================================
CREATE TABLE public.enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_id        UUID,
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  completed_at    TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);

-- ============================================================
-- 10. COURSE PROGRESS
-- ============================================================
CREATE TABLE public.course_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  lesson_id       INTEGER NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  watch_duration  INTEGER DEFAULT 0,  -- seconds
  completed_at    TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX idx_progress_enrollment ON public.course_progress(enrollment_id);

-- ============================================================
-- 11. COUPONS
-- ============================================================
CREATE TABLE public.coupons (
  id              SERIAL PRIMARY KEY,
  code            VARCHAR(50) UNIQUE NOT NULL,
  type            VARCHAR(20) NOT NULL CHECK (type IN ('percent', 'fixed')),
  value           NUMERIC(10,2) NOT NULL,
  max_uses        INTEGER,
  current_uses    INTEGER NOT NULL DEFAULT 0,
  min_order       NUMERIC(10,2) DEFAULT 0,
  course_id       INTEGER REFERENCES public.courses(id) ON DELETE SET NULL,
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       INTEGER NOT NULL REFERENCES public.courses(id),
  coupon_id       INTEGER REFERENCES public.coupons(id) ON DELETE SET NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  final_amount    NUMERIC(10,2) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  payment_method  VARCHAR(50),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_course ON public.orders(course_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================================
-- 13. PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway         VARCHAR(50) NOT NULL,  -- 'sslcommerz'
  transaction_id  VARCHAR(255),
  gateway_ref     VARCHAR(255),
  amount          NUMERIC(10,2) NOT NULL,
  currency        VARCHAR(10) NOT NULL DEFAULT 'BDT',
  status          VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'cancelled', 'refunded')),
  raw_response    JSONB,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_transaction ON public.payments(transaction_id);

-- ============================================================
-- 14. REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body        TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

CREATE INDEX idx_reviews_course ON public.reviews(course_id);

-- ============================================================
-- 15. TESTIMONIALS
-- ============================================================
CREATE TABLE public.testimonials (
  id              SERIAL PRIMARY KEY,
  student_name    VARCHAR(255) NOT NULL,
  student_photo   TEXT,
  course_name     VARCHAR(255),
  batch           VARCHAR(100),
  review          TEXT NOT NULL,
  rating          SMALLINT CHECK (rating >= 1 AND rating <= 5),
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 16. FREE RESOURCES
-- ============================================================
CREATE TABLE public.resources (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  title_bn        VARCHAR(255),
  description     TEXT,
  category        VARCHAR(100),
  subject         VARCHAR(100),
  file_type       VARCHAR(20),
  file_url        TEXT NOT NULL,
  thumbnail_url   TEXT,
  download_count  INTEGER NOT NULL DEFAULT 0,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title       VARCHAR(255),
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 17. BLOG CATEGORIES
-- ============================================================
CREATE TABLE public.blog_categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  name_bn     VARCHAR(255),
  slug        VARCHAR(255) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 18. BLOG POSTS
-- ============================================================
CREATE TABLE public.blog_posts (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(500) NOT NULL,
  title_bn        VARCHAR(500),
  slug            VARCHAR(500) UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  featured_image  TEXT,
  author_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id     INTEGER REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  seo_title       VARCHAR(255),
  seo_description TEXT,
  og_image_url    TEXT,
  canonical_url   TEXT,
  published_at    TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);

-- ============================================================
-- 19. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  body        TEXT,
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================
-- 20. SEO METADATA (polymorphic)
-- ============================================================
CREATE TABLE public.seo_metadata (
  id              SERIAL PRIMARY KEY,
  entity_type     VARCHAR(50) NOT NULL,  -- 'page', 'course', 'category', etc.
  entity_id       VARCHAR(255),          -- slug or id
  title           VARCHAR(255),
  description     TEXT,
  og_title        VARCHAR(255),
  og_description  TEXT,
  og_image        TEXT,
  canonical_url   TEXT,
  no_index        BOOLEAN NOT NULL DEFAULT FALSE,
  structured_data JSONB,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

-- ============================================================
-- 21. SITE SETTINGS
-- ============================================================
CREATE TABLE public.site_settings (
  key         VARCHAR(255) PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"Ormission"'),
  ('site_tagline', '"Learn · Build · Grow"'),
  ('contact_email', '"info@ormission.com"'),
  ('contact_phone', '""'),
  ('social_facebook', '""'),
  ('social_youtube', '""'),
  ('social_instagram', '""'),
  ('social_linkedin', '""'),
  ('payment_sslcommerz_enabled', 'false'),
  ('analytics_enabled', 'false');


-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
      AND table_name != 'seo_metadata'
      AND table_name != 'site_settings'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t
    );
  END LOOP;
END;
$$;


-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profile is created on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Categories (public read, admin write)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published subcategories are viewable by everyone"
  ON public.subcategories FOR SELECT USING (true);

CREATE POLICY "Admins can manage subcategories"
  ON public.subcategories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Course Progress
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON public.course_progress FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.enrollments WHERE id = enrollment_id AND user_id = auth.uid())
  );

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Blog Posts (public read published)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admins can manage posts"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Instructors (public read)
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published instructors are viewable by everyone"
  ON public.instructors FOR SELECT USING (true);

-- Testimonials (public read published)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT
  USING (is_published = TRUE);

-- Resources (public read published)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (is_published = TRUE);

-- Lessons, Sections, Lesson Resources (public read)
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course sections are viewable by everyone"
  ON public.course_sections FOR SELECT USING (true);

CREATE POLICY "Published lessons are viewable by everyone"
  ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Lesson resources viewable by enrolled users"
  ON public.lesson_resources FOR SELECT USING (true);

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Users can create reviews for enrolled courses"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = reviews.course_id AND is_active = TRUE)
  );

-- Site Settings (public read)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
  ON public.site_settings FOR SELECT USING (true);

-- SEO Metadata (public read)
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO metadata is viewable by everyone"
  ON public.seo_metadata FOR SELECT USING (true);

-- Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons are viewable for validation"
  ON public.coupons FOR SELECT
  USING (is_active = TRUE);

-- Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Blog Categories (public read)
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories are viewable by everyone"
  ON public.blog_categories FOR SELECT USING (true);


-- ============================================================
-- FUNCTION: Create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.phone,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
