CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'archived', 'spam');--> statement-breakpoint
CREATE TABLE "lead_access_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"actor" varchar(160) NOT NULL,
	"action" varchar(40) NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"company" varchar(160),
	"topic" varchar(64) NOT NULL,
	"message" text NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"consent_policy_version" varchar(20) NOT NULL,
	"source_ip" varchar(64),
	"user_agent" text,
	"attribution" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_access_log" ADD CONSTRAINT "lead_access_log_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");