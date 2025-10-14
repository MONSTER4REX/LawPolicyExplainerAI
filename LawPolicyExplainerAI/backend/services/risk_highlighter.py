from typing import List
from backend.utils.config_loader import get_ai_config


def analyze_risks(document_text: str) -> str:
    """Detect potential risks/concerns in the document.

    Uses GROQ if available; otherwise, falls back to simple keyword heuristic.
    Returns a concise bullet-style string.
    """
    cfg = get_ai_config()
    groq_key = cfg.get("groq_api_key")
    model = cfg.get("groq_model", "llama-3.1-8b-instant")

    if groq_key:
        try:
            from groq import Groq

            client = Groq(api_key=groq_key)
            prompt = (
                "Identify any potentially risky or concerning clauses in the following text. "
                "Write 3-7 concise bullet points, plain-language, avoiding legal jargon. "
                "Focus on data sharing, auto-renewals, arbitration, warranty disclaimers, liability limits, and privacy.\n\n"
                "Text:\n" + document_text
            )
            completion = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=400,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"GROQ API error: {e}, using fallback risk analysis")

    # Fallback heuristic: keyword spotting
    keywords = [
        "third party", "third-party", "share data", "sell data", "advertisers",
        "auto-renew", "automatic renewal", "binding arbitration", "waive", "warranty",
        "liability", "indemnify", "terminate anytime", "tracking", "cookies",
    ]
    lowered = document_text.lower()
    hits: List[str] = []
    for kw in keywords:
        if kw in lowered:
            hits.append(f"Potential risk mentioned: '{kw}'")
    if not hits:
        return "No obvious high-risk clauses detected by heuristic."
    return "\n".join(f"- {h}" for h in hits)




