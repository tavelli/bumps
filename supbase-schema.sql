-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  description text,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.races (
  id integer NOT NULL DEFAULT nextval('races_id_seq'::regclass),
  year integer NOT NULL,
  event_id integer NOT NULL,
  event_date date,
  CONSTRAINT races_pkey PRIMARY KEY (id),
  CONSTRAINT races_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.results (
  id integer NOT NULL DEFAULT nextval('results_id_seq'::regclass),
  rider_id integer,
  race_id integer,
  year integer NOT NULL,
  points numeric,
  CONSTRAINT results_pkey PRIMARY KEY (id),
  CONSTRAINT results_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.riders(id),
  CONSTRAINT results_race_id_fkey FOREIGN KEY (race_id) REFERENCES public.races(id)
);
CREATE TABLE public.riders (
  id integer NOT NULL,
  name text NOT NULL,
  birth_year integer,
  gender text CHECK (gender = ANY (ARRAY['M'::text, 'W'::text])),
  CONSTRAINT riders_pkey PRIMARY KEY (id)
);