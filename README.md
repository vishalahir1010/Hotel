# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Hotel booking demo

The Aurelia Resort UI includes date-based room availability, a demo reservation and cancellation flow, guest booking lookup, reservation reviews and ratings, and saved suites. Reservations, reviews, and saved suites are stored in the current browser's local storage.

The frontend API facade in `src/api/hotelApi.js` provides suite and add-on catalogues, date availability, booking lookup and cancellation, reviews, and saved-suite operations. It validates reservation data and recalculates totals before saving.

Checkout is **demo-only**: it does not charge a payment method, does not request or store card details, and does not send booking data to a hotel or payment provider. Local browser storage is not a production booking database; real reservations and online payments require a secure backend and payment-provider integration.
