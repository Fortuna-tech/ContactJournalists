alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" alter column "id" set default gen_random_uuid();


