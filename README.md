# Gravity Ball

Simple game with @react-three/fiber

_NOTE: this is a simple draft, not a final product_

## Local development

Set Node.js version specified in `.nvmrc` file:

```bash
nvm use
```

(Optional) Create a file with environment variables for debugging:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

## Build for production

Build the project (it also runs ESLint & TypeScript checks):

```bash
npm run build
npm run export
```

Once built, it can be previewed via:

```bash
npm run prod
```
