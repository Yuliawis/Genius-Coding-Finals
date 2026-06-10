create extension if not exists pgcrypto;

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  submitted_at timestamptz not null default timezone('utc', now()),
  disaster_type text not null,
  description text not null,
  location text not null,
  urgency text not null,
  requester_name text not null,
  contact text not null,
  image_name text,
  image_mime_type text,
  image_base64 text,
  image_provided boolean not null default false,
  severity text not null,
  severity_confidence numeric(4, 3),
  analysis_source text not null,
  analysis_mode text not null,
  routing_tag text,
  response_window text,
  severity_message text,
  visible_indicators jsonb not null default '[]'::jsonb,
  request_payload jsonb not null default '{}'::jsonb,
  severity_assessment jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists help_requests_submitted_at_idx on public.help_requests (submitted_at desc);
create index if not exists help_requests_severity_idx on public.help_requests (severity);
create index if not exists help_requests_analysis_source_idx on public.help_requests (analysis_source);
