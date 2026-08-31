import { supabase } from '../lib/supabase'

/**
 * Envia uma imagem para o bucket "produtos" e retorna a URL pública.
 */
export async function uploadImagemProduto(file) {
  const extensao = file.name.split('.').pop()
  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`

  const { error } = await supabase.storage.from('produtos').upload(nomeArquivo, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from('produtos').getPublicUrl(nomeArquivo)
  return { url: data.publicUrl, error: null }
}
