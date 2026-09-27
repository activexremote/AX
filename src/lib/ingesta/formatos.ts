// Constantes compartidas entre el servidor (que lee los archivos) y el
// navegador (que los ofrece). En su propio archivo porque extract.ts es
// `server-only`: importarlo desde un componente del navegador no compila, y
// con razón —ahí dentro hay código que no pinta nada en un cliente—.

/** Tope de subida. Coincide con el límite de las acciones (next.config.ts). */
export const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Lo que ofrece el selector de archivos.
 *
 * Los de Google Drive no están porque no existen como archivo: un documento
 * de Drive se descarga ya convertido a PDF o a Office, y esos sí están.
 */
export const ACCEPT =
  ".pdf,.txt,.md,.markdown,.csv,.tsv,.rtf,.doc,.docx,.odt,.xls,.xlsx,.ods,.ppt,.pptx,.odp,.png,.jpg,.jpeg,.webp,.gif,application/pdf,text/*,image/*";
