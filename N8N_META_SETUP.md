# Configuração N8N → Meta Conversions API

## 🎯 Objetivo

Receber webhooks da landing page e enviar eventos qualificados para Meta (Facebook Ads) usando a Conversions API.

---

## 📋 Dados Recebidos

### Webhook `/webhook/page-view`
```json
{
  "external_id": "sess_1776139209280_utwx2c2kk",
  "event": "pageview",
  "device_type": "desktop",
  "browser": "Chrome",
  "ip": "177.104.13.132"
}
```

### Webhook `/webhook/IC`
```json
{
  "external_id": "sess_1776139209280_utwx2c2kk",
  "event": "lead_capture",
  "user_data": {
    "email_hash": "f37773777e0ed965b73d476246558f51b0d4655ef76d54d61a3f2bab4ad114f5",
    "whatsapp_hash": "5603c22d00bf7b8dc2e62455839f473e536a54af286d4b1ff938b084b019c60b"
  },
  "conversion_data": {
    "event_type": "InitiateCheckout",
    "plan": "anual",
    "value": 358.8,
    "currency": "BRL"
  }
}
```

---

## 🔑 Dados Necessários do Meta

Você precisa de:
1. **Pixel ID**: ID do seu Meta Pixel (encontra em Meta Business Suite)
2. **Access Token**: Token de acesso para API (com escopo `ads_management`)

---

## 🛠️ Passo 1: Obter Pixel ID e Access Token

1. **Pixel ID:**
   - Vá em Meta Business Suite → Events Manager → Seu Pixel
   - Copie o ID (ex: `876977525291177`)

2. **Access Token:**
   - Meta Business Suite → Settings → User & Access
   - Ou use o Admin Panel do Meta para gerar um token de longa duração

---

## 📐 Passo 2: Configurar Workflows no N8N

### **Workflow 1: Pageview Event**

**Trigger:** Webhook `/webhook/page-view`

**Nodes:**

#### Node 1: Webhook Trigger
- Trigger: `Webhook` (já recebendo)
- Parse body as JSON: ✅

#### Node 2: Transform Payload
- Use `Function` ou `Code` node
- **Input:** body from webhook
- **Output:** Payload formatado para Meta

```javascript
// Transform para Meta
const meta_payload = {
  "data": [
    {
      "event_name": "ViewContent",
      "event_time": Math.floor(Date.now() / 1000),
      "action_source": "website",
      "event_id": $json.external_id,
      "event_source_url": $json.page_url,
      "user_data": {
        "external_id": $json.external_id,
        "ip": $json.ip,
        "ua": $json.user_agent
      },
      "custom_data": {
        "content_name": "MeuCaixa",
        "content_type": "product"
      }
    }
  ],
  "access_token": "{{PIXEL_ACCESS_TOKEN}}"
}

return meta_payload
```

#### Node 3: HTTP Request
- **Method:** POST
- **URL:** `https://graph.facebook.com/v18.0/{{PIXEL_ID}}/events`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** (passar do Node 2)

---

### **Workflow 2: Lead Capture Event (IC)**

**Trigger:** Webhook `/webhook/IC`

**Nodes:**

#### Node 1: Webhook Trigger
- Trigger: `Webhook` (já recebendo)

#### Node 2: Filter by Event Type
- Condition: `body.event === "lead_capture"`
- Se não for lead_capture, ignora

#### Node 3: Transform Payload
```javascript
const meta_payload = {
  "data": [
    {
      "event_name": "InitiateCheckout",
      "event_time": Math.floor(Date.now() / 1000),
      "action_source": "website",
      "event_id": $json.external_id,
      "event_source_url": $json.page_url,
      "user_data": {
        "external_id": $json.external_id,
        "em": $json.user_data.email_hash,  // email_hash
        "ph": $json.user_data.whatsapp_hash,  // phone_hash
        "ip": $json.ip,
        "ua": $json.user_agent
      },
      "custom_data": {
        "value": $json.conversion_data.value,
        "currency": $json.conversion_data.currency,
        "content_name": `Plano ${$json.conversion_data.plan === 'mensal' ? 'Mensal' : 'Anual'}`,
        "content_type": "product",
        "content_id": $json.conversion_data.plan
      }
    }
  ],
  "access_token": "{{PIXEL_ACCESS_TOKEN}}"
}

return meta_payload
```

#### Node 4: HTTP Request
- **Method:** POST
- **URL:** `https://graph.facebook.com/v18.0/{{PIXEL_ID}}/events`
- **Body:** (do Node 3)

---

## 🔐 Passo 3: Variáveis de Ambiente no N8N

1. Vá em N8N → Settings → Variables
2. Crie:
   ```
   PIXEL_ID = 876977525291177
   PIXEL_ACCESS_TOKEN = seu_access_token_aqui
   ```

3. Use no HTTP Request como:
   ```
   {{$env.PIXEL_ID}}
   {{$env.PIXEL_ACCESS_TOKEN}}
   ```

---

## ✅ Payload Final para Meta

### ViewContent
```json
{
  "data": [
    {
      "event_name": "ViewContent",
      "event_time": 1712140041,
      "action_source": "website",
      "event_id": "sess_1776139209280_utwx2c2kk",
      "event_source_url": "https://meucaixa.cloud/",
      "user_data": {
        "external_id": "sess_1776139209280_utwx2c2kk",
        "ip": "177.104.13.132",
        "ua": "Mozilla/5.0..."
      },
      "custom_data": {
        "content_name": "MeuCaixa",
        "content_type": "product"
      }
    }
  ],
  "access_token": "EAA..."
}
```

### InitiateCheckout
```json
{
  "data": [
    {
      "event_name": "InitiateCheckout",
      "event_time": 1712140049,
      "action_source": "website",
      "event_id": "sess_1776139209280_utwx2c2kk",
      "event_source_url": "https://meucaixa.cloud/",
      "user_data": {
        "external_id": "sess_1776139209280_utwx2c2kk",
        "em": "f37773777e0ed965b73d476246558f51b0d4655ef76d54d61a3f2bab4ad114f5",
        "ph": "5603c22d00bf7b8dc2e62455839f473e536a54af286d4b1ff938b084b019c60b",
        "ip": "177.104.13.132",
        "ua": "Mozilla/5.0..."
      },
      "custom_data": {
        "value": 358.80,
        "currency": "BRL",
        "content_name": "Plano Anual",
        "content_type": "product",
        "content_id": "anual"
      }
    }
  ],
  "access_token": "EAA..."
}
```

---

## 🧪 Teste na Meta

1. Configure os workflows acima
2. Vá em Meta Events Manager
3. Clique em **"Test Events"**
4. Cole um payload de teste
5. Clique **Send**
6. Se aparecer ✅, está funcionando!

---

## 🐛 Troubleshooting

### Erro: "Invalid access_token"
- Token expirou
- Gerar novo em Meta Business Suite

### Erro: "Invalid phone or email"
- Email/phone não foi hashado corretamente
- Verifique se está usando SHA256

### Erro: "Event not received"
- Pode levar até 5 minutos para aparecer no Events Manager
- Verifique os logs do N8N

---

## 📊 Próximas Melhorias

- [ ] Purchase event (após transação no Asaas)
- [ ] Lead event (enviar também para CRM)
- [ ] Adicionar validações de dados
- [ ] Retry logic em caso de erro
- [ ] Logs em banco de dados

---

**Pronto para configurar? Me avisa qualquer dúvida!**
