<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Conventions

- Brand colors used in components (e.g. the WhatsApp green) are declared as CSS tokens in `src/styles.css` and consumed through Tailwind utilities — never hardcoded hex in JSX, so theming and dark mode keep working.
- Contact details, phone/WhatsApp numbers and site copy stay in `src/content/portfolio.ts`; components import them instead of inlining values, so the site owner can update everything from one file.
- Project detail pages use a slug-based TanStack route and the central project collection; generated explanatory visuals must be identified as illustrations, never authentic project screenshots.
- The portfolio header and footer are shared components (`Header`, `Footer`) across all pages, keeping branding, navigation, social links, contact accessibility and copyright consistent.
- Every content route sets og:image/twitter:image from the `shareImage` constant in `src/content/portfolio.ts` (built from `siteUrl`), so share previews stay consistent and absolute.
- Error/status pages (404, 401, 403, project not found, unexpected error) all render the shared `ErrorPage` component with noindex, so they stay consistent with the site design.
