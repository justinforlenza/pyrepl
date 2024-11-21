/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace(
        '%unocss-svelte-scoped.global%',
        'unocss_svelte_scoped_global_styles',
      ),
  })
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  return response
}
