# 3D Bottle Editor

## Requirements

You need some environment variables for local development. The `.env.example` shows which variables we need.
#### Contact the following email address for demo data: info@rissc.com

```bash
PF_URL= ''
PF_DRAFT= ''
PF_TOKEN= ''
NPM_TOKEN= ''
```
After filling out all vars we can create a `.env` file or copy the `.env.example`:

```bash
cp .env.example .env 
```
The `NPM_REGISTRY_TOKEN` in the `.npmrc` is needed for authentication with our NPM-Registry. `npm install` will only work if you've been authenticated.

After that you can safely run `npm install` without authentication issues.



## Local Development 
You can use the predefined `npm run dev` command. The parcel-bundler will automatically build and watch the files for changes.

```bash
npm run dev
```
The project is now available at `http://localhost:1234`   

## Publish
Use the `npm run build` command and upload the archive to the themes section in your printfomer.

```bash
npm run build
```
