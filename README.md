# GoBookIt

Continuous Integration & Deploy

Status

- CI & Deploy (Vercel):
  ![CI & Deploy](https://github.com/rasfaxo/GoBookIt/actions/workflows/vercel-deploy.yml/badge.svg)
- Preview Deploy (Vercel):
  ![Preview Deploy](https://github.com/rasfaxo/GoBookIt/actions/workflows/preview-vercel.yml/badge.svg)

How to trigger CI

- Push to `main` to run the full CI and production deploy.
- Open a Pull Request targeting `main` to run the preview deploy workflow.

Environment

Set the required repository secrets in GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `APPWRITE_API_KEY`.

For local development, copy `.env.local` from the provided template and fill values.
