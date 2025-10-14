from typing import Tuple
from backend.utils.config_loader import get_ai_config


def summarize_text(document_text: str) -> str:
    """Generate a concise summary using GROQ if available; fallback to heuristic.

    Returns a short, plain-language summary suitable for display.
    """
    cfg = get_ai_config()
    groq_key = cfg.get("groq_api_key")
    model = cfg.get("groq_model", "llama-3.1-8b-instant")

    if groq_key:
        try:
            from groq import Groq

            client = Groq(api_key=groq_key)
            prompt = (
                "You are a helpful assistant. Summarize the following legal/policy text in plain language, "
                "keeping it concise (3-5 sentences). Avoid legal jargon.\n\nText:\n" + document_text
            )
            completion = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=300,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"GROQ API error: {e}, using fallback summary")

    # Fallback: take first ~3 sentences as a naive summary
    sentences = [s.strip() for s in document_text.replace("\n", " ").split(".") if s.strip()]
    if sentences:
        summary = ". ".join(sentences[:3])
        if not summary.endswith("."):
            summary += "."
        return summary
    return "Document summary not available."




