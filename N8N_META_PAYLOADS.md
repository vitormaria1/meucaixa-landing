# Payloads JSON Prontos para N8N → Meta

Copie e cole diretamente no N8N!

---

## 1️⃣ WEBHOOK PAGEVIEW → META (ViewContent)

### Node: HTTP Request

**URL:**
```
https://graph.facebook.com/v18.0/876977525291177/events
```

**Method:** POST

**Body (JSON):**
```json
{
  "data": [
    {
      "event_name": "ViewContent",
      "event_time": "{{ Math.floor(Date.now() / 1000) }}",
      "action_source": "website",
      "event_id": "{{ $json.body.external_id }}",
      "event_source_url": "{{ $json.body.page_url }}",
      "user_data": {
        "external_id": "{{ $json.body.external_id }}",
        "fbc": "{{ $json.body.fbc }}",
        "fbp": "{{ $json.body.fbp }}",
        "client_ip_address": "{{ $json.body.ip }}",
        "client_user_agent": "{{ $json.body.user_agent }}"
      },
      "custom_data": {
        "content_name": "MeuCaixa",
        "content_type": "product",
        "content_category": "landing_page"
      }
    }
  ],
  "access_token": "SEU_TOKEN_AQUI"
}
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

---

## 2️⃣ WEBHOOK IC (InitiateCheckout) → META

### Node: HTTP Request

**URL:**
```
https://graph.facebook.com/v18.0/876977525291177/events
```

**Method:** POST

**Body (JSON):**
```json
{
  "data": [
    {
      "event_name": "InitiateCheckout",
      "event_time": "{{ Math.floor(Date.now() / 1000) }}",
      "action_source": "website",
      "event_id": "{{ $json.body.external_id }}",
      "event_source_url": "{{ $json.body.page_url }}",
      "user_data": {
        "external_id": "{{ $json.body.external_id }}",
        "em": "{{ $json.body.user_data.email_hash }}",
        "ph": "{{ $json.body.user_data.whatsapp_hash }}",
        "fbc": "{{ $json.body.fbc }}",
        "fbp": "{{ $json.body.fbp }}",
        "client_ip_address": "{{ $json.body.ip }}",
        "client_user_agent": "{{ $json.body.user_agent }}"
      },
      "custom_data": {
        "value": "{{ $json.body.conversion_data.value }}",
        "currency": "{{ $json.body.conversion_data.currency }}",
        "content_name": "{{ 'Plano ' + ($json.body.conversion_data.plan === 'mensal' ? 'Mensal' : 'Anual') }}",
        "content_type": "product",
        "content_id": "{{ $json.body.conversion_data.plan }}"
      }
    }
  ],
  "access_token": "SEU_TOKEN_AQUI"
}
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

---

## 📋 Dados que vão ser preenchidos automaticamente:

### Pageview:
- `external_id`: ID único da sessão
- `ip`: IP do visitante
- `user_agent`: Browser info
- `page_url`: URL da página

### InitiateCheckout:
- `external_id`: ID único da sessão
- `email_hash`: SHA256 do email
- `whatsapp_hash`: SHA256 do whatsapp
- `value`: Valor do plano
- `currency`: BRL
- `plan`: mensal ou anual
- `ip`, `user_agent`: Device info

---

## 🔧 Como Usar no N8N

### Para Pageview:
1. Webhook trigger → `/webhook/page-view`
2. Adicione um **HTTP Request** node
3. Cola o URL e Body acima
4. Substitua `SEU_TOKEN_AQUI` pelo seu Access Token
5. Save & Test

### Para InitiateCheckout:
1. Webhook trigger → `/webhook/IC`
2. (Opcional) Filter node: `body.event === "lead_capture"`
3. Adicione um **HTTP Request** node
4. Cola o URL e Body acima
5. Substitua `SEU_TOKEN_AQUI` pelo seu Access Token
6. Save & Test

---

## ✅ Teste

Depois de configurar, envie um evento:

1. Clique no botão "Comprar agora" na landing page
2. Preencha email + whatsapp
3. Clique "Continuar para compra"
4. Verifique os logs do N8N (deve ter sucesso ✅)
5. Vá em Meta Events Manager e veja o evento chegando

---

**Pronto! Só substituir o token e é sucesso!** 🚀
