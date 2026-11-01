# Academy membership setup and operations

This guide applies to [Physical AI Academy](https://physical-ai-academy.vercel.app/) and Supabase project `gtxqappprshwfbmiaomp` in region `eu-west-3`. The dedicated project has been created and the schema in `schema.sql` has been applied.

## Current deployment

The website, sign-in form, client-side Auth integration and per-member data access rules are deployed. **Public registration will not work fully until the project owner completes authentication provider settings in Supabase.** No credential should ever be committed to this repository or pasted into the Academy source.

### 1. Authentication URL configuration (required)

Open the [Auth URL Configuration page](https://supabase.com/dashboard/project/gtxqappprshwfbmiaomp/auth/url-configuration).

- Set **Site URL** to `https://physical-ai-academy.vercel.app/`.
- Add the same URL to **Redirect URLs**, and use explicit Vercel preview URLs only if you intentionally support previews.
- Save.

### 2. Email sign-in for all free members (required to make public email registration work)

Supabase's built-in mail sender is **restricted to project-team recipients** and has severe rate limits. It is not suitable for open registration. Configure a separate SMTP provider, such as Resend, Brevo, Postmark or AWS SES, through the Supabase project's [Auth SMTP settings](https://supabase.com/dashboard/project/gtxqappprshwfbmiaomp/auth/smtp).

- Set verified sender domain/address and SMTP connection settings there.
- Keep SMTP credentials private in the Supabase dashboard; do not commit them.
- Consider CAPTCHA, appropriate email rate limits and monitoring before promoting registration publicly.
- The current form uses `auth.signInWithOtp({email,options:{emailRedirectTo:academyURL}})` and the default **magic link** template. Users can click their emailed link and return to the academy after URLs are configured.
- Optionally switch the Magic Link email template to include `{{ .Token }}`, enabling the Academy's built-in 6–8 digit verification-code field. If you do not customize the template, users should follow the emailed link instead.

See official documentation: [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless), [Auth email templates](https://supabase.com/docs/guides/auth/auth-email-templates).

### 3. Google sign-in (optional)

Open the [Google sign-in provider](https://supabase.com/dashboard/project/gtxqappprshwfbmiaomp/auth/providers).

Configure a Google Cloud OAuth Web application and then enable the Google provider in Supabase.

- Authorized JavaScript origin: `https://physical-ai-academy.vercel.app`
- Authorized redirect URI: `https://gtxqappprshwfbmiaomp.supabase.co/auth/v1/callback`
- Configure Google OAuth client ID and secret **only in the Supabase dashboard**, not in source code.

See: https://supabase.com/docs/guides/auth/social-sign-in/auth-google

## Security model

- `public.academy_progress`: one JSON progress document per authenticated member, with a user ID that references `auth.users`.
- `public.academy_training_runs`: private per-user experimental run metadata for future model training labs.
- Both tables have **Row Level Security enabled**, four owner-only policies, and no public/anonymous table grants.
- Public frontend uses only a Supabase **publishable key**. Do not put secret or service-role keys in public JavaScript.
- Visitors have in-memory training state only; refreshing clears guest learning state.
- Signed-in members synchronize progress and can export/import JSON or erase their saved progress/training runs.
- Previously saved browser data is intentionally **not** automatically assigned to a new account; members can opt into importing it.
- Users can delete saved learning records through the member dashboard. Full account deletion needs a separate authenticated account-deletion service or support workflow.

## Acceptance tests after email/Google provider setup

1. Open the Academy in a private browser window without logging in. Complete a lesson, refresh and verify that guest progress is not retained.
2. Request a sign-in link using a non-team email address. Confirm it arrives via custom SMTP, click it and return to the Academy.
3. Complete a lesson, wait for synchronization, open the site in a second browser, sign in with the same address and verify progress loads.
4. Sign out. Verify that the account's completed lesson is no longer visible to a guest.
5. Sign in with a different account and verify the original member's data is inaccessible. Check RLS denies direct cross-user access.
6. If previous local progress is detected, confirm that import is optional and requires explicit confirmation before replacing cloud progress.
7. Export JSON, delete all saved learning data from the member dashboard, refresh and verify no progress remains.
8. Google authentication, if enabled, must use the same member identity when the emails match (verify account-linking behavior explicitly).

## Operational limitations / roadmap

- Cloud save currently uses a last-write-wins upsert; concurrent edits from several devices are not merged.
- Member learning history and experiment records are private. Practical assignments are self-attested; no uploaded evidence moderation or automatic grading exists yet.
- Production readiness requires verification of the complete sign-in, refresh, recovery, cross-device, and data-deletion flows.
- This project is free to users, but email-sending, Vercel and Supabase each have service limits and may incur operator costs as usage grows.
