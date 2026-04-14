# MeuCaixa Landing Page

Landing page estática para o MeuCaixa - Controle Financeiro Inteligente com WhatsApp e IA.

## 🚀 Features

- ✅ Design responsivo e moderno
- ✅ Meta Pixel integration
- ✅ Lead capture modal (Email + WhatsApp)
- ✅ Tracking system com N8N webhooks
- ✅ SHA256 hashing para dados sensíveis
- ✅ Session tracking com external_id
- ✅ Event deduplication automática
- ✅ IP + User-Agent collection para Meta

## 📁 Estrutura

```
meucaixa-landing/
├── index.html              # Landing page
├── scripts/
│   └── tracking.js         # Sistema de tracking completo
├── .github/workflows/
│   └── deploy.yml          # CI/CD para Cloudflare Pages
└── README.md
```

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/vitormaria1/meucaixa-landing.git
cd meucaixa-landing
```

2. Deploy com Cloudflare Pages:
   - Conecte seu repositório GitHub ao Cloudflare Pages
   - Configure como Branch: `main`
   - Build command: deixe vazio
   - Build output directory: deixe vazio (arquivos na raiz)

## 📊 Sistema de Tracking

### Eventos Coletados

#### 1. **Pageview**
Dispara quando a página carrega:
```json
{
  "external_id": "sess_...",
  "event": "pageview",
  "device_type": "mobile|desktop",
  "browser": "Chrome",
  "ip": "123.456.789.0"
}
```
**Webhook:** `/webhook/page-view`

#### 2. **Button Click**
Dispara quando usuário clica em CTA:
```json
{
  "external_id": "sess_...",
  "event": "button_click",
  "button_id": "cta_mensal",
  "device_type": "mobile"
}
```
**Webhook:** `/webhook/IC`

#### 3. **Lead Capture**
Dispara quando usuário preenche form:
```json
{
  "external_id": "sess_...",
  "event": "lead_capture",
  "user_data": {
    "email": "user@email.com",
    "email_hash": "5d41402abc...",
    "whatsapp": "(11) 99999-9999",
    "whatsapp_hash": "8d3367645f..."
  },
  "conversion_data": {
    "plan": "mensal",
    "value": 39.90,
    "currency": "BRL"
  },
  "ip": "123.456.789.0"
}
```
**Webhook:** `/webhook/IC`

### Session Tracking

- Cada visitante recebe um `external_id` único por sessão
- Armazenado em `localStorage` por 24h
- Permite rastrear jornada completa do usuário

### Deduplication

- Sistema automático que evita enviar o mesmo evento 2x em menos de 5 segundos
- Útil para evitar duplicação de webhooks

### Meta Pixel

- Recebe eventos com dados qualificados (email_hash, whatsapp_hash, external_id)
- InitiateCheckout disparado após lead capture
- Hashes permitem melhor aprendizado do algoritmo

## 🔐 Segurança

- ✅ Email e WhatsApp transformados em SHA256 hash antes de enviar
- ✅ Dados armazenados apenas em localStorage
- ✅ HTTPS obrigatório no Cloudflare
- ✅ Sem cookies rastreadores (apenas session ID)

## 🔌 N8N Webhooks

Configure os seguintes webhooks no N8N:

1. **Pageview Webhook**
   - URL: `/webhook/page-view`
   - Ação: Logar eventos de visualização

2. **Conversion Webhook**
   - URL: `/webhook/IC`
   - Ação: 
     - Armazenar leads
     - Enviar para Meta (HTTP POST)
     - Enviar para WhatsApp (opcional)

## 📱 Modal de Lead Capture

- Email (validado)
- WhatsApp (com máscara automática `(XX) XXXXX-XXXX`)
- Botões: "Voltar" e "Continuar para compra"
- Fecha ao clicar overlay ou X
- Redireciona para Asaas após envio

## 🌐 Deploy

### Cloudflare Pages

1. Connect GitHub ao Cloudflare Pages
2. Selecione este repositório
3. Build settings:
   - Build command: (deixe vazio)
   - Build output directory: (deixe vazio)
4. Deploy

Sempre que fizer push para `main`, a página atualiza automaticamente.

## 📝 Editar Conteúdo

Todos os textos estão no `index.html`. Para editar:
1. Edite o arquivo
2. Faça commit: `git commit -m "desc das mudanças"`
3. Faça push: `git push origin main`
4. Espere 1-2 minutos para deploy automático

## 🎯 Próximos Passos

- [ ] Testar modal no mobile
- [ ] Verificar webhooks no N8N
- [ ] Validar eventos no Meta Pixel
- [ ] A/B testing nos CTA buttons
- [ ] Analytics dashboard próprio

## 📞 Suporte

Email: [email protected]

---

**Desenvolvido com Claude Code + N8N + Cloudflare Pages**
