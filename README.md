# Voto Exposto

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Update data](https://github.com/itroxz/voto_exposto/actions/workflows/update-data.yml/badge.svg)](https://github.com/itroxz/voto_exposto/actions/workflows/update-data.yml)
[![Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg)](https://astro.build)

O **Voto Exposto** é uma tentativa de tornar mais fácil uma coisa que deveria ser simples: descobrir como deputados e senadores votam, quanto aparecem nas sessões e para onde mandam emendas.

A ideia aqui não é fazer panfleto, ranking vazio ou caça-clique. É juntar dados oficiais, organizar de um jeito legível e deixar qualquer pessoa tirar as próprias conclusões.

## O que o projeto quer ser

Um site público, gratuito e aberto para acompanhar o comportamento parlamentar com base em dados da:

- Câmara dos Deputados
- Senado Federal
- Portal da Transparência

O foco é mostrar, sem rodeio:

- como cada parlamentar vota
- frequência em plenário
- alinhamento com o próprio partido
- emendas parlamentares
- comparações entre políticos
- rankings e recortes úteis para exploração

## Status

O projeto já tem uma base funcional de front-end, páginas principais, mock de dados, pipeline inicial de coleta/processamento e estrutura de deploy pensada para Cloudflare.

Hoje ele está em **fase inicial / protótipo funcional**.

Algumas telas já existem e funcionam com dados simulados. A próxima etapa é ligar tudo com dados reais, amadurecer os critérios dos rankings e preparar o deploy público.

## Stack

- **Astro** + **React**
- **TypeScript**
- **D3.js** para visualizações
- **Cloudflare Pages** para hospedagem
- **Cloudflare D1** para armazenamento
- **GitHub Actions** para atualização periódica de dados

## Estrutura atual

- página inicial com busca
- página de busca
- perfil de parlamentar
- página de votação individual
- rankings
- comparador
- página “sobre”
- endpoint simples de busca
- schema inicial do banco D1
- scripts de coleta da Câmara e do Senado
- script de processamento
- script de seed do banco

## Rodando localmente

Instale as dependências:

```bash
npm install
```

Suba o ambiente de desenvolvimento:

```bash
npm run dev
```

Gerar build local:

```bash
npm run build
```

## Scripts úteis

```bash
npm run fetch:camara
npm run fetch:senado
npm run process
npm run seed
npm run update
```

### O que cada um faz

- `fetch:camara`: coleta dados da Câmara
- `fetch:senado`: coleta dados do Senado
- `process`: transforma os dados brutos em um formato unificado
- `seed`: envia os dados processados para o D1
- `update`: roda a sequência completa

## Banco de dados

O schema inicial está em [db/schema.sql](db/schema.sql).

A configuração do Cloudflare está em [wrangler.toml](wrangler.toml). Ainda é preciso trocar os placeholders pelo banco real antes de publicar.

## Atualização automática

Existe um workflow em [.github/workflows/update-data.yml](.github/workflows/update-data.yml) para:

- atualizar os dados 2 vezes por dia
- permitir disparo manual
- processar arquivos
- preparar a etapa de seed no D1

## O que falta

Algumas coisas que ainda precisam ser feitas ou amadurecidas:

- conectar dados reais nas páginas
- definir melhor os critérios de ranking
- revisar performance e cache
- configurar D1 real e deploy no Cloudflare
- melhorar cobertura de testes
- adicionar observabilidade básica

## Princípios do projeto

Este projeto tenta seguir algumas regras simples:

- usar **dados oficiais** como fonte principal
- separar dado de opinião
- deixar claro quando algo for inferência, regra própria ou mock
- manter o código aberto
- evitar barreiras de acesso, cadastro ou paywall

## Contribuição

Se quiser abrir issue, sugerir melhoria, revisar fonte de dados, corrigir critério ou mandar PR, a ajuda é bem-vinda.

Especialmente útil neste começo:

- validação de fontes públicas
- revisão dos scripts de coleta
- revisão de metodologia dos rankings
- melhorias de UX e acessibilidade
- deploy e infraestrutura

## Observação importante

Este repositório ainda está em construção. Parte da interface roda com dados simulados para permitir testar fluxo, navegação e visual antes da integração completa com dados reais.

## Licença

Este projeto está sob a licença MIT.

O texto completo está em [LICENSE](LICENSE).
