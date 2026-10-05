import { HELP_KNOWLEDGE_BASE, HelpTopic } from '../data/helpKnowledgeBase';

export interface HelpSearchResult {
  title: string;
  answer: string;
  steps: string[];
  relatedScreen?: string | null;
  actionLabel?: string | null;
  actionTarget?: string | null;
  highlightTargetId?: string | null;
  source: 'local-kb' | 'gemini-assistant';
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Searches the local knowledge base first using fuzzy/keyword matching.
 */
export function searchLocalKnowledgeBase(query: string): HelpTopic | null {
  const normQuery = normalize(query);
  if (!normQuery) return null;

  const queryWords = normQuery.split(/\s+/).filter((w) => w.length > 2);

  let bestMatch: HelpTopic | null = null;
  let highestScore = 0;

  for (const topic of HELP_KNOWLEDGE_BASE) {
    let score = 0;

    const normTitle = normalize(topic.title);
    if (normTitle.includes(normQuery)) {
      score += 15;
    }

    // Check question examples
    for (const q of topic.questionExamples) {
      const normQ = normalize(q);
      if (normQ.includes(normQuery) || normQuery.includes(normQ)) {
        score += 20;
      }
      for (const w of queryWords) {
        if (normQ.includes(w)) score += 3;
      }
    }

    // Check keywords
    for (const kw of topic.keywords) {
      const normKw = normalize(kw);
      if (normQuery.includes(normKw)) {
        score += 5;
      }
      for (const w of queryWords) {
        if (normKw.includes(w) || w.includes(normKw)) score += 4;
      }
    }

    // Check title words
    for (const w of queryWords) {
      if (normTitle.includes(w)) score += 4;
    }

    if (score > highestScore && score >= 6) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

/**
 * Intelligent help dispatcher:
 * 1. Tries local knowledge base first.
 * 2. If no direct local match, calls server-side Gemini Help Assistant (/api/help).
 */
export async function askHelpAssistant(query: string): Promise<HelpSearchResult> {
  const localMatch = searchLocalKnowledgeBase(query);

  if (localMatch) {
    return {
      title: localMatch.title,
      answer: localMatch.answer,
      steps: localMatch.steps,
      relatedScreen: localMatch.relatedScreen,
      actionLabel: localMatch.actionLabel,
      actionTarget: localMatch.actionTarget,
      highlightTargetId: localMatch.highlightTargetId,
      source: 'local-kb',
    };
  }

  // Fallback to server-side Gemini Help Assistant
  try {
    const res = await fetch('/api/help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: query }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        title: query,
        answer: data.answer || 'Aqui estão as orientações para sua dúvida:',
        steps: data.steps || [],
        relatedScreen: data.relatedScreen || null,
        actionLabel: data.actionLabel || null,
        actionTarget: data.actionTarget || null,
        highlightTargetId: null,
        source: 'gemini-assistant',
      };
    }
  } catch (err) {
    console.warn('Help assistant remote query failed, falling back:', err);
  }

  // Graceful fallback if both fail
  return {
    title: 'Orientações Gerais da Plataforma',
    answer:
      'Posso ajudar com dúvidas sobre o funcionamento da plataforma Harpia Tech (filtros, Score, Ficha Municipal, Pipeline, Monitoramento e Mapas).',
    steps: [
      'Selecione uma das perguntas sugeridas na Central de Ajuda.',
      'Utilize o Radar de Municípios para explorar e comparar dados.',
      'Ou reinicie o Tutorial da Plataforma para rever o passo a passo guiado.',
    ],
    relatedScreen: 'radar',
    actionLabel: 'EXPLORAR RADAR DE MUNICÍPIOS',
    actionTarget: 'radar',
    highlightTargetId: null,
    source: 'local-kb',
  };
}
