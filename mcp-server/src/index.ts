#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Carrega base de trilhas ──────────────────────────────────────────────────
const { tracks } = JSON.parse(
  readFileSync(join(__dirname, "data", "tracks.json"), "utf-8")
) as { tracks: Record<string, Track> };

interface Module {
  week: number;
  title: string;
  topics: string[];
}

interface Challenge {
  title: string;
  description: string;
  hint: string;
  example: string;
}

interface Track {
  name: string;
  icon: string;
  description: string;
  duration: string;
  level: string;
  modules: Module[];
  challenges: Record<string, Challenge[]>;
}

// ─── Server ───────────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "trilha-dev",
  version: "1.0.0",
});

// ─── Tool: listar_trilhas ─────────────────────────────────────────────────────
server.registerTool(
  "listar_trilhas",
  {
    description:
      "Lista todas as trilhas de estudo disponíveis com nome, ícone, duração e nível.",
    inputSchema: z.object({}),
  },
  async () => {
    const result = Object.entries(tracks).map(([key, t]) => ({
      chave: key,
      nome: t.name,
      icone: t.icon,
      duracao: t.duration,
      nivel: t.level,
      descricao: t.description,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ─── Tool: ver_trilha ─────────────────────────────────────────────────────────
server.registerTool(
  "ver_trilha",
  {
    description:
      "Retorna o plano de estudos semanal completo de uma trilha. Ex: javascript, python, react, devops, sql.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe(
          "Chave da tecnologia: javascript | python | react | devops | sql"
        ),
    }),
  },
  async ({ tecnologia }) => {
    const key = tecnologia.toLowerCase();
    const track = tracks[key];
    if (!track) {
      return {
        content: [
          {
            type: "text",
            text: `Trilha "${tecnologia}" não encontrada. Disponíveis: ${Object.keys(tracks).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    const out = {
      nome: track.name,
      icone: track.icon,
      descricao: track.description,
      duracao: track.duration,
      nivel: track.level,
      modulos: track.modules,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
    };
  }
);

// ─── Tool: gerar_desafio ──────────────────────────────────────────────────────
server.registerTool(
  "gerar_desafio",
  {
    description:
      "Gera um desafio de código aleatório para a tecnologia e nível informados.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe(
          "Chave da tecnologia: javascript | python | react | devops | sql"
        ),
      nivel: z
        .string()
        .describe("Nível do desafio: iniciante | intermediario | avancado"),
    }),
  },
  async ({ tecnologia, nivel }) => {
    const key = tecnologia.toLowerCase();
    const lvl = nivel.toLowerCase();
    const track = tracks[key];
    if (!track) {
      return {
        content: [
          {
            type: "text",
            text: `Tecnologia "${tecnologia}" não encontrada. Disponíveis: ${Object.keys(tracks).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    const list = track.challenges[lvl];
    if (!list || list.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Nenhum desafio para ${key} nível "${lvl}". Níveis válidos: iniciante, intermediario, avancado`,
          },
        ],
        isError: true,
      };
    }
    const challenge = list[Math.floor(Math.random() * list.length)];
    return {
      content: [{ type: "text", text: JSON.stringify(challenge, null, 2) }],
    };
  }
);

// ─── Tool: gerar_certificado ──────────────────────────────────────────────────
server.registerTool(
  "gerar_certificado",
  {
    description:
      "Emite um certificado fictício de conclusão de trilha para o aluno informado.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe(
          "Chave da tecnologia: javascript | python | react | devops | sql"
        ),
      nome_aluno: z
        .string()
        .describe("Nome completo do aluno para constar no certificado"),
    }),
  },
  async ({ tecnologia, nome_aluno }) => {
    const key = tecnologia.toLowerCase();
    const track = tracks[key];
    if (!track) {
      return {
        content: [
          {
            type: "text",
            text: `Tecnologia "${tecnologia}" não encontrada. Disponíveis: ${Object.keys(tracks).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    if (!nome_aluno.trim()) {
      return {
        content: [{ type: "text", text: "Informe o nome completo do aluno." }],
        isError: true,
      };
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const hash = [...(nome_aluno + key + now.getFullYear())].reduce(
      (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
      0
    );
    const certId =
      "DIO-" +
      key.slice(0, 3).toUpperCase() +
      "-" +
      Math.abs(hash).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);

    const certificado = {
      titulo: "CERTIFICADO DE CONCLUSÃO",
      instituicao: "DIO — Digital Innovation One",
      aluno: nome_aluno.toUpperCase(),
      trilha: `${track.icon} ${track.name}`,
      carga_horaria: track.duration,
      nivel_alcancado: track.level,
      data_emissao: dateStr,
      codigo_certificado: certId,
      observacao:
        "Certificado fictício gerado pela CLI trilha-dev para fins educacionais.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(certificado, null, 2) }],
    };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("trilha-dev MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
