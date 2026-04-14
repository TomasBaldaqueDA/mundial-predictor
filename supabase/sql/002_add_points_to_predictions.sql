alter table public.predictions
add column if not exists points integer not null default 0;

