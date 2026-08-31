import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Registra a intenção de reserva (quando o Supabase está conectado) e monta
 * o link do WhatsApp formatado — o fluxo funciona mesmo sem banco, pois o
 * WhatsApp é sempre o canal de confirmação final com o restaurante.
 */
export async function criarReserva({ unidade, nomeCliente, telefone, data, horario, pessoas, observacoes }) {
  if (isSupabaseConfigured) {
    await supabase.from('reservas').insert({
      unidade_id: unidade.id,
      nome_cliente: nomeCliente,
      telefone,
      data_reserva: data,
      horario,
      pessoas,
      observacoes,
    })
  }

  const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
  const mensagem = [
    `Olá! Gostaria de reservar uma mesa no Tarumã ${unidade.nome}.`,
    `📅 Data: ${dataFormatada}`,
    `🕒 Horário: ${horario}`,
    `👥 Pessoas: ${pessoas}`,
    `🙋 Nome: ${nomeCliente}`,
    observacoes ? `📝 Observações: ${observacoes}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  // ⚠️ O link salvo em whatsapp_url hoje é um redirecionador (supersal.com.br)
  // e não foi confirmado se ele repassa o parâmetro ?text= para o WhatsApp.
  // Se não repassar, troque whatsapp_url no banco pelo link direto
  // "https://wa.me/55SEUNUMERO" pra a mensagem pré-preenchida funcionar.
  const whatsappUrl = `${unidade.whatsapp_url}?text=${encodeURIComponent(mensagem)}`

  return { whatsappUrl }
}
