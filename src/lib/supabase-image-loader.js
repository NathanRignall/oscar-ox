export default function supabaseLoader({ src, width, quality }) {
    return `http://localhost:54321/storage/v1/render/image/public/${src}?width=${width}&quality=${quality || 75}`
}