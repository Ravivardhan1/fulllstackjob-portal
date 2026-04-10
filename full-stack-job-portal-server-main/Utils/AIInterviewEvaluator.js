const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function extractResponseText(payload) {
    if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
        return payload.output_text.trim();
    }

    if (!Array.isArray(payload?.output)) {
        return "";
    }

    for (const item of payload.output) {
        if (!Array.isArray(item?.content)) {
            continue;
        }

        for (const content of item.content) {
            if (typeof content?.text === "string" && content.text.trim()) {
                return content.text.trim();
            }
        }
    }

    return "";
}

function normalizeList(items, fallback) {
    if (!Array.isArray(items)) {
        return fallback;
    }

    const cleaned = items
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, 3);

    return cleaned.length > 0 ? cleaned : fallback;
}

function clampScore(score) {
    const numeric = Number(score);
    if (!Number.isFinite(numeric)) {
        return 10;
    }

    return Math.min(20, Math.max(0, Math.round(numeric)));
}

function getQualityFromScore(score) {
    if (score >= 16) return "Excellent";
    if (score >= 12) return "Good";
    if (score >= 8) return "Average";
    return "Poor";
}

function buildFallbackEvaluation(answerItems) {
    return answerItems.map((item) => {
        const normalizedAnswer = String(item.userAnswer || "").trim();
        const sampleAnswer = String(item.sampleAnswer || "").trim();
        const answerWords = normalizedAnswer.toLowerCase().split(/\W+/).filter(Boolean);
        const sampleWords = sampleAnswer.toLowerCase().split(/\W+/).filter(Boolean);
        const sampleWordSet = new Set(sampleWords.filter((word) => word.length > 3));
        const overlap = answerWords.filter((word) => sampleWordSet.has(word));
        const overlapRatio = sampleWordSet.size > 0 ? overlap.length / sampleWordSet.size : 0;

        let score = 6;
        if (!normalizedAnswer) {
            score = 0;
        } else if (overlapRatio >= 0.6) {
            score = 17;
        } else if (overlapRatio >= 0.35) {
            score = 14;
        } else if (overlapRatio >= 0.15) {
            score = 10;
        }

        return {
            questionId: item.questionId,
            score,
            quality: getQualityFromScore(score),
            feedback: normalizedAnswer
                ? "AI evaluation is unavailable right now, so this answer used a simplified backup review. Add your OpenAI key for accurate semantic evaluation."
                : "No meaningful answer was submitted for this question.",
            strengths: normalizedAnswer
                ? normalizeList(item.tips, ["Attempted the question and covered at least part of the topic."])
                : ["No clear strength could be identified because the answer was empty."],
            improvements: normalizedAnswer
                ? ["Add more accurate role-specific concepts and explain them clearly.", "Use a more complete answer that directly addresses the question."]
                : ["Provide a direct answer to the question.", "Include practical details or examples to support your response."],
            suggestions: normalizedAnswer
                ? ["Review the sample answer and compare missing concepts.", "Practice explaining the same concept in your own words with one example."]
                : ["Write at least 2-3 clear points before submitting.", "Use the provided tips to structure your next attempt."]
        };
    });
}

function sanitizeEvaluations(answerItems, parsedEvaluations) {
    const evaluationMap = new Map(
        (Array.isArray(parsedEvaluations) ? parsedEvaluations : []).map((item) => [String(item.questionId), item])
    );

    return answerItems.map((item) => {
        const raw = evaluationMap.get(String(item.questionId)) || {};
        const score = clampScore(raw.score);
        const quality = ["Excellent", "Good", "Average", "Poor"].includes(raw.quality)
            ? raw.quality
            : getQualityFromScore(score);

        return {
            questionId: item.questionId,
            score,
            quality,
            feedback:
                String(raw.feedback || "").trim() ||
                "Your answer was reviewed, but detailed feedback could not be generated.",
            strengths: normalizeList(raw.strengths, [
                "Attempted the question and provided a response.",
            ]),
            improvements: normalizeList(raw.improvements, [
                "Make the answer more precise and directly aligned with the question.",
            ]),
            suggestions: normalizeList(raw.suggestions, [
                "Review the sample answer and practice a more structured response.",
            ]),
        };
    });
}

async function evaluateAnswersWithAI(answerItems, metadata = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
        return {
            evaluations: buildFallbackEvaluation(answerItems),
            provider: "fallback",
            model: "heuristic"
        };
    }

    if (typeof fetch !== "function") {
        return {
            evaluations: buildFallbackEvaluation(answerItems),
            provider: "fallback",
            model: "heuristic"
        };
    }

    const schema = {
        type: "object",
        properties: {
            evaluations: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        questionId: { type: "string" },
                        score: { type: "integer", minimum: 0, maximum: 20 },
                        quality: {
                            type: "string",
                            enum: ["Excellent", "Good", "Average", "Poor"]
                        },
                        feedback: { type: "string" },
                        strengths: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                            maxItems: 3
                        },
                        improvements: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                            maxItems: 3
                        },
                        suggestions: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                            maxItems: 3
                        }
                    },
                    required: [
                        "questionId",
                        "score",
                        "quality",
                        "feedback",
                        "strengths",
                        "improvements",
                        "suggestions"
                    ],
                    additionalProperties: false
                }
            }
        },
        required: ["evaluations"],
        additionalProperties: false
    };

    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
            model: DEFAULT_MODEL,
            input: [
                {
                    role: "system",
                    content: [
                        {
                            type: "input_text",
                            text:
                                "You are an expert technical interview evaluator. Score answers based on correctness, completeness, relevance, conceptual accuracy, and communication clarity. Do not reward or punish answer length by itself. Compare each answer to the question, expected answer, key points, and accepted alternatives. Give coaching-friendly feedback."
                        }
                    ]
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: JSON.stringify({
                                interviewContext: metadata,
                                answers: answerItems
                            })
                        }
                    ]
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "interview_answer_evaluation",
                    strict: true,
                    schema
                }
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI evaluation failed: ${response.status} ${errorText}`);
    }

    const payload = await response.json();
    const rawText = extractResponseText(payload);

    if (!rawText) {
        throw new Error("OpenAI evaluation returned no text output.");
    }

    const parsed = JSON.parse(rawText);

    return {
        evaluations: sanitizeEvaluations(answerItems, parsed.evaluations),
        provider: "openai",
        model: DEFAULT_MODEL
    };
}

module.exports = {
    evaluateAnswersWithAI,
    getQualityFromScore
};
