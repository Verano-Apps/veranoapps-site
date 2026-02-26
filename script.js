const I18N = {
    "pt-BR": {
        "ui.theme": "Tema",

        "nav.apps": "Apps",
        "nav.about": "Sobre",
        "nav.contact": "Contato",

        "hero.kicker": "Estúdio independente",
        "hero.title": "Apps minimalistas.\nFeitos com intenção.",
        "hero.subtitle": "Produtos mobile focados em clareza, privacidade e utilidade.",
        "hero.ctaPrimary": "Ver apps",
        "hero.ctaSecondary": "Sobre a Verano",

        // ALTERADO: mensagem de marca (não promessa técnica eterna)
        "hero.note": "Privacidade por padrão. Clareza sempre. Sem ruído.",

        "apps.title": "Apps",
        "apps.subtitle": "Produtos enxutos, consistentes e feitos para durar.",
        "apps.marmitrack.badge": "Android • Offline-first",
        "apps.marmitrack.desc":
            "Controle alimentar minimalista com marmitas, metas e progresso diário — offline-first.",

        // NOVO: promessa técnica por app
        "apps.marmitrack.privacy": "Sem login. Sem anúncios. Sem coleta de dados.",

        "apps.marmitrack.play": "Em breve na Google Play →",

        "status.inprogress": "Em produção",
        "status.published": "Publicado",

        "about.title": "Sobre",
        "about.subtitle":
            "Um estúdio solo construindo software claro, privado e consistente — com foco em produto.",
        "about.principles.title": "Princípios",
        "about.principles.p1": "Minimalismo sem distrações",
        "about.principles.p2": "Privacidade por padrão",
        "about.principles.p3": "Design limpo e funcional",
        "about.story.title": "História",
        "about.story.text":
            "Verano Apps nasceu para criar ferramentas pessoais — simples, rápidas e sem “ruído”. O objetivo é construir um portfólio sólido de produtos reais, do zero ao lançamento.",

        "contact.title": "Contato",
        "contact.subtitle": "Feedback e oportunidades são bem-vindos.",
        "contact.emailLabel": "Email:",

        "footer.tagline": "Minimal • Private • Useful",
    },

    en: {
        "ui.theme": "Theme",

        "nav.apps": "Apps",
        "nav.about": "About",
        "nav.contact": "Contact",

        "hero.kicker": "Independent app studio",
        "hero.title": "Minimal apps.\nBuilt with intention.",
        "hero.subtitle": "Mobile products focused on clarity, privacy, and usefulness.",
        "hero.ctaPrimary": "View apps",
        "hero.ctaSecondary": "About Verano",

        // ALTERADO
        "hero.note": "Privacy by default. Always clear. No noise.",

        "apps.title": "Apps",
        "apps.subtitle": "Focused products, consistent and built to last.",
        "apps.marmitrack.badge": "Android • Offline-first",
        "apps.marmitrack.desc":
            "Minimal food tracking with meals, goals, and daily progress — offline-first.",

        // NOVO
        "apps.marmitrack.privacy": "No login. No ads. No data collection.",

        "apps.marmitrack.play": "Coming soon to Google Play →",

        "status.inprogress": "In progress",
        "status.published": "Published",

        "about.title": "About",
        "about.subtitle":
            "A solo studio building clear, private, consistent software — product-first.",
        "about.principles.title": "Principles",
        "about.principles.p1": "Minimalism without distractions",
        "about.principles.p2": "Privacy by default",
        "about.principles.p3": "Clean, functional design",
        "about.story.title": "Story",
        "about.story.text":
            "Verano Apps exists to build personal tools—simple, fast, and noise-free. The goal is to create a strong portfolio of real products, from zero to launch.",

        "contact.title": "Contact",
        "contact.subtitle": "Feedback and opportunities are welcome.",
        "contact.emailLabel": "Email:",

        "footer.tagline": "Minimal • Private • Useful",
    },
};

const STORAGE = {
    lang: "verano_lang",
    theme: "verano_theme",
};

function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE.theme, theme);
}

function setLanguage(lang) {
    const dict = I18N[lang] || I18N.en;

    document.documentElement.lang = lang === "pt-BR" ? "pt-BR" : "en";
    localStorage.setItem(STORAGE.lang, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = dict[key];
        if (typeof value !== "string") return;
        el.textContent = value;
    });

    const pill = document.getElementById("langPill");
    if (pill) pill.textContent = lang === "pt-BR" ? "PT" : "EN";
}

function init() {
    document.getElementById("year").textContent = new Date().getFullYear();

    applyTheme(getPreferredTheme());
    document.getElementById("themeToggle")?.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
    });

    const savedLang = localStorage.getItem(STORAGE.lang);
    const defaultLang = savedLang || "pt-BR";
    setLanguage(defaultLang);

    document.getElementById("langToggle")?.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE.lang) || defaultLang;
        setLanguage(current === "pt-BR" ? "en" : "pt-BR");
    });
}

init();