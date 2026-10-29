#!/usr/bin/env python3
"""شغّله مرة واحدة بجانب index.html (يحتاج إنترنت): python download_assets.py
ينزّل كل الصور والأصوات إلى مجلد assets/img و assets/audio بنفس الأسماء التي يستخدمها index.html"""
import os, urllib.request
FILES = {
    "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/iq.svg": "assets/img/flag-iq.svg",
    "https://l.top4top.io/p_3941h4i6h1.png": "assets/img/logo-about.png",
    "https://e.top4top.io/p_3878nmsha0.png": "assets/img/report-jam.png",
    "https://i.top4top.io/p_3878lj0zs2.png": "assets/img/report-accident.png",
    "https://b.top4top.io/p_38784xcdo0.png": "assets/img/report-radar.png",
    "https://g.top4top.io/p_3878wdti30.png": "assets/img/report-excavation.png",
    "https://h.top4top.io/p_387847t3v1.png": "assets/img/report-rough-road.png",
    "https://g.top4top.io/m_3873zo61q0.mp3": "assets/audio/right-turn.mp3",
    "https://f.top4top.io/m_3900lgeu40.mp3": "assets/audio/left-turn-near.mp3",
    "https://b.top4top.io/m_3900ebgti0.mp3": "assets/audio/right-turn-100m.mp3",
    "https://e.top4top.io/m_3900pdmjg0.mp3": "assets/audio/left-turn-100m.mp3",
    "https://i.top4top.io/m_3900660j60.mp3": "assets/audio/roundabout-exit1.mp3",
    "https://b.top4top.io/m_3900zy3ep0.mp3": "assets/audio/roundabout-exit2.mp3",
    "https://f.top4top.io/m_3900cfiuf0.mp3": "assets/audio/arrival.mp3",
    "https://h.top4top.io/m_3934ad2zh1.mp3": "assets/audio/fuel-station-alert.mp3",
    "https://b.top4top.io/m_3934u5u151.mp3": "assets/audio/intersection-alert.mp3",
    "https://g.top4top.io/m_3865fmrzm0.mp3": "assets/audio/dest-sound.mp3",
    "https://f.top4top.io/m_3868qgdqp0.mp3": "assets/audio/congestion-check.mp3",
    "https://k.top4top.io/m_38685vemo0.mp3": "assets/audio/voice-nav.mp3"
}
here = os.path.dirname(os.path.abspath(__file__))
for url, path in FILES.items():
    dest = os.path.join(here, path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print("موجود  ", path); continue
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
            f.write(r.read())
        print("تم     ", path)
    except Exception as e:
        print("فشل    ", path, "<-", url, e)
