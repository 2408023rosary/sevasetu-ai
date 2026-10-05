const env = require('../config/environment');

exports.classifyComplaint = async (complaint) => {
    if (!env.AI_SERVICE_URL) return null;

    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, env.AI_SERVICE_TIMEOUT_MS);

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (env.AI_SERVICE_API_KEY) {
            headers.Authorization = `Bearer ${env.AI_SERVICE_API_KEY}`;
        }

        const text = [
            complaint.title || '',
            complaint.description || ''
        ]
            .filter(Boolean)
            .join('. ');

        const response = await fetch(env.AI_SERVICE_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                text,
                existing_complaints: []
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(
                `AI service returned ${response.status}`
            );
        }

        const data = await response.json();

        if (
            data.category_confidence != null &&
            (
                Number(data.category_confidence) < 0 ||
                Number(data.category_confidence) > 1
            )
        ) {
            throw new Error(
                'AI category confidence must be between 0 and 1'
            );
        }

        return {
            category: data.category,
            confidence: data.category_confidence,
            priority: data.priority,
            priorityScore: data.priority_score,
            priorityReasons: data.priority_reasons,
            imageAnalysis: data.image_analysis,
            duplicateAnalysis: data.duplicate_analysis
        };
    } finally {
        clearTimeout(timer);
    }
};