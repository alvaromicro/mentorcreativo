# Mentor creativo — web para compartir

Web lista para que **otra persona la pruebe** (razona con Claude de verdad) sin
que tu API key quede expuesta. La key vive **solo en el servidor**.

```
mentor-web/
├─ index.html        ← la web (habla con /api/mentor, no con Anthropic directo)
├─ api/mentor.js     ← backend: guarda la key oculta y reenvía a Anthropic
├─ package.json
└─ README-DEPLOY.md  ← este archivo
```

## Deploy en Vercel (5 min, gratis)

1. Entrá a **vercel.com** y creá una cuenta (podés usar tu email o GitHub).
2. La forma más simple sin git: desde una terminal, dentro de esta carpeta:

   ```bash
   npx vercel
   ```

   Seguí las preguntas (aceptá los valores por defecto). Al terminar te da una URL.
3. Cargá tu API key como **variable de entorno** (NO va en el código):

   ```bash
   npx vercel env add ANTHROPIC_API_KEY
   ```

   Pegá tu `sk-ant-...` cuando lo pida. Elegí los 3 entornos (Production/Preview/Development).
4. Volvé a desplegar para que tome la variable:

   ```bash
   npx vercel --prod
   ```

5. Listo. La URL `...vercel.app` que te dio es la que le pasás a quien quiera probarlo.

> Alternativa con panel web: subí esta carpeta a un repo de GitHub → en Vercel
> "Add New Project" → importá el repo → en **Settings → Environment Variables**
> agregá `ANTHROPIC_API_KEY` con tu clave → Deploy.

## ⚠️ Importante: poné un tope de gasto

Como **paga tu cuenta** por cada persona que lo use, protegete:

- En **console.anthropic.com → Billing → Limits** ponele un límite mensual bajo
  (ej. USD 10). Aunque el link se filtre, el daño está acotado.
- Opcional: candado simple. Definí también la variable `MENTOR_TOKEN` (una palabra
  secreta) en Vercel; el backend rechaza pedidos sin ese token. (Requiere que el
  front lo mande en el header `x-mentor-token` — pedímelo y lo cableo.)

## Costos

Se paga por uso (no hay suscripción). Con Sonnet, cada respuesta ronda centavos de
dólar. Con USD 5–10 de crédito probás muchísimo.

## Modelo

Por defecto usa `claude-sonnet-5`. Para cambiarlo, editá el valor por defecto en
`api/mentor.js` (campo `model`).
