# 🤝 Contribuindo com Skills

Guia para adicionar, melhorar ou manter skills neste workspace.

## 📋 Antes de Começar

- Leia [claude.md](claude.md) para entender a filosofia
- Veja [QUICKSTART.md](QUICKSTART.md) para guia prático
- Estude [SKILL_TEMPLATE.md](SKILL_TEMPLATE.md) para estrutura

## ✅ Checklist para Nova Skill

### Estrutura
- [ ] Pasta criada em `/skills/[categoria]/[skill-name]` (kebab-case)
- [ ] `SKILL.md` preenchido com frontmatter completo
- [ ] Categoria correta no metadata
- [ ] Tags relevantes adicionadas

### Conteúdo (SKILL.md)
- [ ] **"When to Use"** tem 3+ use cases específicos
- [ ] **"Core Principle"** é uma única frase clara
- [ ] **4 fases** documentadas:
  - [ ] Phase 1: Brief/Input (o que você precisa)
  - [ ] Phase 2: Planning (abordagem)
  - [ ] Phase 3: Execution (como fazer, com templates)
  - [ ] Phase 4: Polish (checklist, variações)
- [ ] **Example** com input e output concretos
- [ ] **Anti-Patterns** listam 3+ erros comuns
- [ ] **Recovery** com soluções para cenários difíceis

### Documentação
- [ ] Não há erros de digitação
- [ ] Markdown está bem formatado
- [ ] Links internos funcionam (ex: `/related-skill`)
- [ ] Estrutura é consistente com outras skills

### Código (se aplicável)
- [ ] Scripts em `/scripts` (Python, JS, etc)
- [ ] Cada script tem comentários
- [ ] Referências em `/references` (guides, templates, examples)

### Integração
- [ ] Skill adicionada a [SKILLS_INDEX.md](SKILLS_INDEX.md)
- [ ] Entrada em [SKILLS_INDEX.md](SKILLS_INDEX.md) segue formato padrão
- [ ] `.gitignore` cobre arquivos gerados

## 🏗️ Estrutura de uma Boa Skill

### Exemplo Mínimo (Essencial)
```
skill-name/
└── SKILL.md
```

### Exemplo Completo (Recomendado)
```
skill-name/
├── SKILL.md                    # Documentação
├── scripts/                    # (opcional)
│   ├── main.py
│   └── utils.py
└── references/                 # (opcional)
    ├── guide.md
    └── examples.json
```

## 🎯 Padrões de Qualidade

### SKILL.md deve ter

| Aspecto | Padrão |
|---------|--------|
| **Length** | 200-1000 linhas (balance entre detalhado e conciso) |
| **Tone** | Direto, imperativo, útil |
| **Structure** | 4 fases linearmente (Brief → Planning → Execution → Polish) |
| **Examples** | Pelo menos 1 exemplo completo (input → output) |
| **Checklists** | Cada fase com seu checklist |
| **Code** | Se houver, bem comentado e testado |

### Escrita
- Use **bold** para conceitos-chave
- Use `code blocks` para templates e exemplos
- Use bullet points para listas
- Mantenha parágrafos curtos (2-3 linhas)
- Seja específico (não genérico)

### Exemplo de Escrita Boa
```markdown
**Benefits must answer "So what?" from the visitor's perspective.**
Wrong: "Automated workflow engine" (feature)
Right: "Save 5 hours per week" (outcome)
```

### Exemplo de Escrita Ruim
```markdown
This skill is really useful for many things. You can use it in different ways. It has lots of benefits.
```

## 🔄 Atualizando Skills Existentes

1. **Melhore a documentação** se encontrar erros ou gaps
2. **Adicione exemplos** se a skill for vaga
3. **Divida skills grandes** se exceder 1000 linhas
4. **Crie skills complementares** se encontrar padrões

Ao atualizar:
- Mantenha compatibilidade (não quebre workflows existentes)
- Documente mudanças no frontmatter `version`
- Se for breaking change, considere criar nova skill

## 📚 Nomeação

### Skill Names (kebab-case)
```
✅ landing-page-copy
✅ email-newsletter-template
✅ facebook-ad-campaign
❌ Landing Page Copy
❌ emailNewsletterTemplate
❌ facebook_ad_campaign
```

### Categorias
```
marketing/         → Copywriting, ads, funnels, sales
technical/         → Frontend, backend, dev tools
automation/        → Scraping, APIs, integrações
design/            → UI/UX, design systems, CRO
tools/             → Utilities, miscellaneous
knowledge/         → Conteúdo, guias, referências
```

## 🧪 Testando sua Skill

1. **Invoque em um projeto test**: `/skill-name`
2. **Siga os passos** documentados
3. **Verifique outputs** contra checklist
4. **Teste anti-patterns** para validar avisos

## 📋 Antes de Comitar

```bash
# Verifique estrutura
ls -la skills/[categoria]/[skill-name]/

# Verifique SKILL.md
cat skills/[categoria]/[skill-name]/SKILL.md

# Verifique integridade
grep "skill-name" SKILLS_INDEX.md
```

## 🚀 Deployment Checklist

- [ ] Estrutura correta
- [ ] SKILL.md completo (4 fases)
- [ ] Exemplo de input → output
- [ ] Anti-patterns documentados
- [ ] Scripts (se houver) estão em `/scripts`
- [ ] Referências (se houver) estão em `/references`
- [ ] Skill adicionada a SKILLS_INDEX.md
- [ ] Nomes estão em kebab-case
- [ ] Sem erros de digitação
- [ ] Links internos funcionam

## 💡 Dúvidas?

- Veja skills similares para padrão
- Releia [SKILL_TEMPLATE.md](SKILL_TEMPLATE.md)
- Estude [skills/marketing/landing-page-copy/SKILL.md](skills/marketing/landing-page-copy/SKILL.md) como referência

---

**Obrigado por contribuir!** 🙌
