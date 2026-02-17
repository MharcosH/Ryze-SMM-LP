// ========================================
// SISTEMA DE PRECIFICAÇÃO - EngajaTopBrasil
// ========================================

// Configuration
const MEU_WHATSAPP = '5562981215567';

// TABELAS DE PREÇOS BASE (preço por unidade)
const precosBase = {
    instagram: {
        seguidores: {
            mundial: 0.020,      // R$ 0.020 por seguidor mundial
            brasileiro: 0.065    // R$ 0.065 por seguidor brasileiro
        },
        curtidas: {
            mundial: 0.015,      // R$ 0.015 por curtida mundial
            brasileiro: 0.045    // R$ 0.045 por curtida brasileira
        },
        visualizacoes: {
            global: 0.008        // R$ 0.008 por visualização
        },
        comentarios: {
            mundial: 0.80,       // R$ 0.80 por comentário mundial
            brasileiro: 1.50     // R$ 1.50 por comentário brasileiro
        }
    },

    tiktok: {
        seguidores: {
            mundial: 0.018,      // R$ 0.018 por seguidor mundial
            brasileiro: 0.060    // R$ 0.060 por seguidor brasileiro
        },
        visualizacoes: {
            global: 0.006        // R$ 0.006 por visualização
        },
        curtidas: {
            mundial: 0.012,      // R$ 0.012 por curtida mundial
            brasileiro: 0.040    // R$ 0.040 por curtida brasileira
        }
    },

    youtube: {
        inscritos: {
            mundial: 0.045,      // R$ 0.045 por inscrito mundial
            brasileiro: 0.120    // R$ 0.120 por inscrito brasileiro
        },
        likes: {
            mundial: 0.018,      // R$ 0.018 por like mundial
            brasileiro: 0.050    // R$ 0.050 por like brasileiro
        },
        visualizacoes: {
            global: 0.010        // R$ 0.010 por visualização
        },
        comentarios: {
            brasileiro: 1.80     // R$ 1.80 por comentário brasileiro
        }
    },

    facebook: {
        seguidores: {
            mundial: 0.022,      // R$ 0.022 por seguidor mundial
            brasileiro: 0.068    // R$ 0.068 por seguidor brasileiro
        },
        curtidas: {
            mundial: 0.016,      // R$ 0.016 por curtida mundial
            brasileiro: 0.048    // R$ 0.048 por curtida brasileira
        },
        visualizacoes: {
            global: 0.009        // R$ 0.009 por visualização
        }
    },

    kwai: {
        seguidores: {
            mundial: 0.020,      // R$ 0.020 por seguidor mundial
            brasileiro: 0.062    // R$ 0.062 por seguidor brasileiro
        },
        mix: {
            brasileiro: 0.010    // R$ 0.010 por mix (curtidas + views)
        }
    }
};

// SISTEMA DE DESCONTOS POR FIDELIDADE
const descontos = {
    bronze: 0.00,             // Sem desconto (R$ 0 - R$ 99,99 gastos)
    prata: 0.03,              // 3% OFF (R$ 100 - R$ 499,99 gastos)
    ouro: 0.10                // 10% OFF (acima de R$ 500 gastos)
};

// ========================================
// FUNÇÕES DE CÁLCULO
// ========================================

/**
 * Determina o nível do usuário baseado no valor gasto
 * @param {number} valorGasto - valor total gasto pelo usuário
 * @returns {string} - bronze, prata ou ouro
 */
function determinarNivelUsuario(valorGasto) {
    if (valorGasto >= 500) return 'ouro';
    if (valorGasto >= 100) return 'prata';
    return 'bronze';
}

/**
 * Obtém o total gasto pelo usuário do localStorage
 * @returns {number} - valor total gasto
 */
function getUserTotalSpent() {
    const spent = localStorage.getItem('userTotalSpent');
    return spent ? parseFloat(spent) : 0;
}

/**
 * Atualiza o total gasto pelo usuário no localStorage
 * @param {number} amount - valor a adicionar aos gastos
 */
function updateUserTotalSpent(amount) {
    const currentSpent = getUserTotalSpent();
    const newTotal = currentSpent + amount;
    localStorage.setItem('userTotalSpent', newTotal.toString());
}

/**
 * Obtém o nível atual do usuário
 * @returns {string} - bronze, prata ou ouro
 */
function getUserLevel() {
    const totalSpent = getUserTotalSpent();
    return determinarNivelUsuario(totalSpent);
}

/**
 * Aplica desconto ao preço
 * @param {number} preco - preço base
 * @param {number} percentualDesconto - percentual de desconto (0.03 = 3%)
 * @returns {number} - preço com desconto
 */
function aplicarDesconto(preco, percentualDesconto) {
    return preco * (1 - percentualDesconto);
}

/**
 * Calcula preço final com desconto de fidelidade
 * @param {number} precoBase - preço antes dos descontos
 * @param {string} nivelUsuario - bronze, prata, ouro
 * @returns {object} - objeto com preço original, descontos e preço final
 */
function calcularPrecoFinal(precoBase, nivelUsuario = null) {
    if (!nivelUsuario) {
        nivelUsuario = getUserLevel();
    }

    const descontoNivel = descontos[nivelUsuario] || 0;
    const precoFinal = aplicarDesconto(precoBase, descontoNivel);

    return {
        precoOriginal: precoBase,
        descontoAplicado: precoBase - precoFinal,
        precoFinal: precoFinal,
        percentualDesconto: descontoNivel * 100,
        nivelUsuario: nivelUsuario
    };
}

// Advanced Service Data Structure
const servicesData = {
    instagram: [
        {
            id: 'ig_followers', name: 'Seguidores',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.020 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.065 }
            ]
        },
        {
            id: 'ig_likes', name: 'Curtidas',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
            min: 100, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.015 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.045 }
            ]
        },
        {
            id: 'ig_views', name: 'Visualizações',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            min: 500, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Global', price_per_unit: 0.008 }
            ]
        },
        {
            id: 'ig_comments', name: 'Comentários',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
            disclaimer: 'Os comentários terão relação direta com o conteúdo do post!',
            min: 5, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.80 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 1.50 }
            ]
        }
    ],
    tiktok: [
        {
            id: 'tt_followers', name: 'Seguidores',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.018 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.060 }
            ]
        },
        {
            id: 'tt_likes', name: 'Curtidas',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
            min: 100, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.012 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.040 }
            ]
        },
        {
            id: 'tt_views', name: 'Visualizações',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            min: 500, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Global', price_per_unit: 0.006 }
            ]
        }
    ],
    youtube: [
        {
            id: 'yt_subs', name: 'Inscritos',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.045 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.120 }
            ]
        },
        {
            id: 'yt_likes', name: 'Likes',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
            min: 100, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.018 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.050 }
            ]
        },
        {
            id: 'yt_views', name: 'Visualizações',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            disclaimer: 'Atenção: Apenas para Vídeos Normais (Não Shorts).',
            min: 500, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Global', price_per_unit: 0.010 }
            ]
        },
        {
            id: 'yt_comments', name: 'Comentários',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
            min: 5, requiresPostLink: true,
            types: [
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 1.80 }
            ]
        }
    ],
    facebook: [
        {
            id: 'fb_followers', name: 'Seguidores',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
            disclaimer: 'Funciona para Perfil (Modo Profissional) e Página.',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.022 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.068 }
            ]
        },
        {
            id: 'fb_likes', name: 'Curtidas',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
            disclaimer: 'Atenção: Apenas para Postagens (Fotos/Textos).',
            min: 100, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.016 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.048 }
            ]
        },
        {
            id: 'fb_views', name: 'Visualizações',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            min: 500, requiresPostLink: true,
            types: [
                { id: 'global', name: '🌍 Global', price_per_unit: 0.009 }
            ]
        }
    ],
    kwai: [
        {
            id: 'kw_followers', name: 'Seguidores',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_unit: 0.020 },
                { id: 'br', name: '🇧🇷 Brasileiros', price_per_unit: 0.062 }
            ]
        },
        {
            id: 'kw_likes_views', name: 'Curtidas + Views',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
            min: 500, requiresPostLink: true,
            types: [
                { id: 'br', name: '🇧🇷 Mix Brasileiro', price_per_unit: 0.010 }
            ]
        }
    ],
    outros: [
        {
            id: 'dg_members', name: 'Telegram Membros',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
            min: 100, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_1k: 8.00 }
            ]
        },
        {
            id: 'tw_followers', name: 'Twitch Seguidores',
            icon: '<svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            min: 50, requiresPostLink: false,
            types: [
                { id: 'global', name: '🌍 Globais', price_per_1k: 10.00 }
            ]
        }
    ]
};

const platforms = [
    {
        id: 'instagram',
        name: 'Instagram',
        color: 'text-pink-500 border-pink-500/50',
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        color: 'text-white border-white/50',
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        color: 'text-red-500 border-red-500/50',
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        color: 'text-blue-500 border-blue-500/50',
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    },
    {
        id: 'kwai',
        name: 'Kwai',
        color: 'text-orange-500 border-orange-500/50',
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 13.5v-2c0-.8-.7-1.5-1.5-1.5H5c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h9c.8 0 1.5-.7 1.5-1.5v-2l4 3.5V10l-4 3.5z"/></svg>'
    },
    {
        id: 'outros',
        name: 'Outros',
        color: 'text-gray-400 border-gray-400/50',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>'
    }
];

// Combos Data
const combosData = {
    instagram: [
        {
            id: 'ig_start', name: 'Combo Start 🚀',
            badges: ['PARA PERFIL', 'Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 19.90 },
                { name: '🇧🇷 Brasileiros', price: 49.90 }
            ],
            benefits: ['500 Seguidores', '500 Curtidas', '1.000 Visualizações', '10 Comentários']
        },
        {
            id: 'ig_engaja', name: 'Combo Engaja 🔥',
            badges: ['POPULAR', 'Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 39.90 },
                { name: '🇧🇷 Brasileiros', price: 99.90 }
            ],
            benefits: ['1.000 Seguidores', '1.000 Curtidas', '5.000 Visualizações', '20 Comentários']
        },
        {
            id: 'ig_influencer', name: 'Combo Influencer 💎',
            badges: ['VIP', 'Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 149.90 },
                { name: '🇧🇷 Brasileiros', price: 340.00 }
            ],
            benefits: ['5.000 Seguidores', '5.000 Curtidas', '10.000 Visualizações', '100 Comentários']
        }
    ],
    tiktok: [
        {
            id: 'tt_viral', name: 'Combo Viral 🎵',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 12.90 },
                { name: '🇧🇷 Brasileiros', price: 32.90 }
            ],
            benefits: ['5.000 Visualizações', '500 Curtidas', '100 Seguidores']
        },
        {
            id: 'tt_crescimento', name: 'Combo Crescimento 📈',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 29.90 },
                { name: '🇧🇷 Brasileiros', price: 79.90 }
            ],
            benefits: ['1.000 Seguidores', '10.000 Visualizações', '1.000 Curtidas']
        }
    ],
    youtube: [
        {
            id: 'yt_start', name: 'Combo Start ▶️',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 39.90 },
                { name: '🇧🇷 Brasileiros', price: 88.00 }
            ],
            benefits: ['100 Inscritos', '1.000 Visualizações', '100 Likes', '10 Comentários']
        },
        {
            id: 'yt_monetiza', name: 'Combo Monetiza 💰',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 159.90 },
                { name: '🇧🇷 Brasileiros', price: 304.00 }
            ],
            benefits: ['500 Inscritos', '5.000 Visualizações', '500 Likes', '50 Comentários']
        }
    ],
    facebook: [
        {
            id: 'fb_pagina', name: 'Combo Página 🔵',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 18.30 },
                { name: '🇧🇷 Brasileiros', price: 47.90 }
            ],
            benefits: ['500 Seguidores', '500 Curtidas Post']
        },
        {
            id: 'fb_social', name: 'Combo Social 👍',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 39.90 },
                { name: '🇧🇷 Brasileiros', price: 92.70 }
            ],
            benefits: ['1.000 Seguidores', '2.000 Curtidas Post']
        }
    ],
    kwai: [
        {
            id: 'kw_start', name: 'Combo Start 🟧',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 15.90 },
                { name: '🇧🇷 Brasileiros', price: 36.70 }
            ],
            benefits: ['500 Seguidores', '2.000 Mix (Views+Curtidas)']
        },
        {
            id: 'kw_viral', name: 'Combo Viral 🌪️',
            badges: ['Máxima Qualidade'],
            options: [
                { name: '🌍 Global', price: 47.90 },
                { name: '🇧🇷 Brasileiros', price: 92.70 }
            ],
            benefits: ['2.000 Seguidores', '10.000 Mix (Views+Curtidas)']
        }
    ]
};

// State
let currentPlatform = 'instagram';
let currentComboPlatform = 'instagram';
let cart = []; // Changed from currentService to cart array
let appliedCoupon = null;
let currentOrderId = null;

// Cart Persistence
function saveCart() {
    localStorage.setItem('ryze_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('ryze_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCounter(); // We will implement this
    }
}

// User Spending Persistence
function getUserTotalSpent() {
    const spent = localStorage.getItem('userTotalSpent');
    return spent ? parseFloat(spent) : 0;
}

function updateUserTotalSpent(amount) {
    const currentSpent = getUserTotalSpent();
    const newTotal = currentSpent + amount;
    localStorage.setItem('userTotalSpent', newTotal.toString());
}

// DOM Elements
const tabsContainer = document.getElementById('tabs-container');
const servicesGrid = document.getElementById('services-grid');
const modal = document.getElementById('checkout-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPanel = document.getElementById('modal-panel');
const closeModalBtn = document.getElementById('close-modal-btn');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const finalizeOrderBtn = document.getElementById('finalize-order-btn');
const profileInput = document.getElementById('profile-link');
const postInput = document.getElementById('post-link');

// Initialization
function init() {
    loadCart();
    renderTabs();
    renderServices('instagram');
    setupEventListeners();
    // validateForm(); // Moved to modal open
    initTypingEffect();

    // Init Combos
    renderComboTabs();
    renderCombos('instagram');

    updateCartCounter();
}

// Typing Effect
function initTypingEffect() {
    const textElement = document.getElementById('dynamic-text');
    const words = ['Instagram', 'TikTok', 'Youtube', 'Twitch', 'Telegram', 'Kwai'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deleting
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // Normal typing
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Render Tabs - DARK THEME
function renderTabs() {
    tabsContainer.innerHTML = platforms.map(p => `
        <button
            onclick="switchTab('${p.id}')"
            class="px-5 py-2.5 rounded-xl font-medium text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border
            ${currentPlatform === p.id
            ? `${p.color} bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]`
            : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}">
            ${p.icon}
            ${p.name}
        </button>
    `).join('');
}

// Switch Tab
window.switchTab = (platformId) => {
    currentPlatform = platformId;
    renderTabs();

    // Animate grid
    const servicesGridSection = document.getElementById('services-grid-section');
    servicesGrid.classList.add('opacity-0', 'translate-y-4');

    // Also animate dropdown container if exists
    const mobileSelector = document.getElementById('mobile-services-selector');
    if (mobileSelector) mobileSelector.classList.add('opacity-0', 'translate-y-4');

    setTimeout(() => {
        renderServices(platformId);
        servicesGrid.classList.remove('opacity-0', 'translate-y-4');
        servicesGrid.classList.add('transition-all', 'duration-500');

        if (mobileSelector) {
            mobileSelector.classList.remove('opacity-0', 'translate-y-4');
            mobileSelector.classList.add('transition-all', 'duration-500');
        }
    }, 200);
};

// Render Calculator Services - DARK THEME + MOBILE SELECTOR
function renderServices(platformId) {
    const categoryServices = servicesData[platformId] || [];

    // Clear grid first
    servicesGrid.innerHTML = '';

    // Remove existing mobile selector if any
    const existingSelector = document.getElementById('mobile-services-selector');
    if (existingSelector) existingSelector.remove();

    if (categoryServices.length === 0) {
        servicesGrid.innerHTML = `<div class="col-span-full text-center py-10"><p class="text-gray-500">Nenhum serviço disponível.</p></div>`;
        return;
    }

    // Dynamic Grid Layout Logic
    servicesGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-500';
    if (categoryServices.length > 3) {
        servicesGrid.classList.add('lg:grid-cols-4');
    } else {
        servicesGrid.classList.add('lg:grid-cols-3');
    }

    // --- MOBILE SELECTOR LOGIC ---
    // Inject Select Element before grid (only visible on mobile)
    const mobileSelectorHtml = `
        <div id="mobile-services-selector" class="md:hidden w-full max-w-md mx-auto mb-8 px-4">
            <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">O que você deseja?</label>
            <div class="relative">
                <select id="mobile-service-select" onchange="toggleMobileService(this.value)" class="block w-full rounded-xl border border-gray-700 bg-[#1a1a1a] text-white py-3 pl-4 pr-10 shadow-lg focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-base appearance-none outline-none font-medium">
                    ${categoryServices.map((s, index) => `<option value="${s.id}" ${index === 0 ? 'selected' : ''}>${s.icon} ${s.name}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-purple">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    `;

    // Insert selector before the grid
    servicesGrid.insertAdjacentHTML('beforebegin', mobileSelectorHtml);

    // Render Cards
    const cardsHtml = categoryServices.map((service, index) => {
        const initialType = service.types[0];
        const initialQty = Math.max(1000, service.min);
        const basePrice = initialQty * initialType.price_per_unit;
        const priceInfo = calcularPrecoFinal(basePrice);
        const initialPrice = priceInfo.precoFinal.toFixed(2).replace('.', ',');

        // Mobile visibility logic: only show first item by default on mobile
        const mobileClass = index === 0 ? 'flex' : 'hidden';

        return `
        <div class="service-card-item bg-brand-card rounded-2xl p-6 border border-brand-border hover:border-brand-purple/50 transition-all group relative overflow-hidden flex flex-col items-center text-center shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] ${mobileClass} md:flex md:w-full" id="card-${service.id}">
            <!-- Glow -->
            <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <!-- Quality Badge -->
            <div class="w-full flex justify-start mb-4">
                <div class="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    <span class="text-[10px]">💎</span> Máxima Qualidade
                </div>
            </div>

            <!-- Icon & Name -->
            <div class="w-16 h-16 bg-[#1a1a1a] border border-gray-800 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                ${service.icon}
            </div>
            <h3 class="font-bold text-white text-lg mb-4 tracking-wide flex items-center justify-center gap-2">
                ${service.name}
                ${service.disclaimer ? `<div class="cursor-pointer text-gray-400 hover:text-white transition-colors" onclick="openInfoModal('${service.disclaimer.replace(/'/g, "\\'")}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 01-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg></div>` : ''}
            </h3>

            <!-- Calculator Form -->
            <div class="w-full bg-[#151515] rounded-xl p-4 border border-gray-800 mb-4">

                <!-- Type Selector -->
                <div class="mb-3 text-left">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tipo:</label>
                    <div class="relative">
                        <select id="type-${service.id}" onchange="updateCardPrice('${service.id}')" class="block w-full rounded-lg border-gray-700 bg-[#222] text-white py-2.5 pl-3 pr-8 shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple sm:text-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors appearance-none outline-none">
                            ${service.types.map(t => `<option value="${t.id}" data-price="${t.price_per_unit}">${t.name}</option>`).join('')}
                        </select>
                         <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <!-- Quantity Input -->
                <div class="text-left">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                        Quantidade (Min: ${service.min}):
                    </label>
                    <input type="number" id="qty-${service.id}"
                           value="" placeholder="${service.min}"
                           min="${service.min}"
                           oninput="updateCardPrice('${service.id}')"
                           class="block w-full rounded-lg border-gray-700 bg-[#222] text-white py-2.5 pl-3 shadow-sm placeholder:text-gray-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple sm:text-sm transition-all outline-none">
                    <p id="error-${service.id}" class="text-xs text-red-500 mt-1 hidden font-medium">Mínimo de ${service.min}</p>
                </div>
            </div>

            <!-- Price Display -->
            <div class="mb-6 w-full flex justify-between items-center px-2">
                <span class="text-gray-500 text-sm font-medium">Total estimado:</span>
                <div class="text-2xl font-bold text-brand-purple tracking-tight" id="price-${service.id}">R$ 0,00</div>
            </div>

            <!-- Add Button -->
            <button
                id="btn-${service.id}"
                onclick="addToCart('${service.id}')"
                disabled
                class="w-full bg-brand-purple text-white font-bold py-3.5 px-4 rounded-xl hover:bg-purple-600 transition-all shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                Adicionar ao Carrinho
            </button>
        </div>
    `}).join('');

    servicesGrid.innerHTML = cardsHtml;
}

// Global function to toggle service visibility on mobile
window.toggleMobileService = (selectedServiceId) => {
    // Hide all cards first (add hidden class, but keep md:block for desktop)
    const allCards = document.querySelectorAll('.service-card-item');
    allCards.forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('block'); // Ensure block is removed if present
    });

    // Show selected card
    const selectedCard = document.getElementById(`card-${selectedServiceId}`);
    if (selectedCard) {
        selectedCard.classList.remove('hidden');
        selectedCard.classList.add('block');
    }
};

// Update Price & Validate logic
window.updateCardPrice = (serviceId) => {
    // Find service data
    let service = null;
    for (const key in servicesData) {
        const found = servicesData[key].find(s => s.id === serviceId);
        if (found) { service = found; break; }
    }
    if (!service) return;

    const typeSelect = document.getElementById(`type-${serviceId}`);
    const qtyInput = document.getElementById(`qty-${serviceId}`);
    const priceDisplay = document.getElementById(`price-${serviceId}`);
    const btn = document.getElementById(`btn-${serviceId}`);
    const errorMsg = document.getElementById(`error-${serviceId}`);

    const selectedOption = typeSelect.options[typeSelect.selectedIndex];
    const pricePerUnit = parseFloat(selectedOption.getAttribute('data-price'));
    const qty = parseInt(qtyInput.value) || 0;

    if (qty < service.min) {
        if (qty > 0) {
            qtyInput.classList.add('border-red-500', 'bg-red-500/10');
            qtyInput.classList.remove('focus:border-brand-purple');
            errorMsg.textContent = `Mínimo de ${service.min}`;
            errorMsg.classList.remove('hidden');
        }
        btn.disabled = true;
        priceDisplay.textContent = 'R$ 0,00';
    } else {
        qtyInput.classList.remove('border-red-500', 'bg-red-500/10');
        qtyInput.classList.add('focus:border-brand-purple');
        errorMsg.classList.add('hidden');

        // Calculate with new pricing system
        const basePrice = qty * pricePerUnit;
        const priceInfo = calcularPrecoFinal(basePrice);

        priceDisplay.textContent = `R$ ${priceInfo.precoFinal.toFixed(2).replace('.', ',')}`;
        btn.disabled = false;
    }

    if (!qtyInput.value || qty === 0) {
        qtyInput.classList.remove('border-red-500', 'bg-red-500/10');
        errorMsg.classList.add('hidden');
        priceDisplay.textContent = 'R$ 0,00';
        btn.disabled = true;
    }
};

window.addToCart = (serviceId) => {
    let service = null;
    for (const key in servicesData) {
        const found = servicesData[key].find(s => s.id === serviceId);
        if (found) { service = found; break; }
    }
    if (!service) return;

    const typeSelect = document.getElementById(`type-${serviceId}`);
    const qtyInput = document.getElementById(`qty-${serviceId}`);
    const selectedOption = typeSelect.options[typeSelect.selectedIndex];

    const qty = parseInt(qtyInput.value);
    const pricePerUnit = parseFloat(selectedOption.getAttribute('data-price'));

    // Base price calculation (without loyalty discount yet - applied at checkout total)
    const basePrice = qty * pricePerUnit;

    const newItem = {
        id: Date.now(), // Unique ID for cart item
        serviceId: service.id,
        name: service.name,
        type: selectedOption.textContent,
        qty: qty,
        unit_price: pricePerUnit,
        base_price: basePrice, // Total for this item
        requiresPostLink: service.requiresPostLink,
        isCombo: false
    };

    cart.push(newItem);
    saveCart();
    updateCartCounter();

    // Show toast or visual feedback?
    // For now, just the counter update is enough as requested "floating icon"
    const btn = document.getElementById('floating-cart-btn');
    if (btn) {
        btn.classList.add('scale-110');
        setTimeout(() => btn.classList.remove('scale-110'), 200);
    }
};

window.addComboToCart = (comboId, platformId) => {
    const combo = combosData[platformId].find(c => c.id === comboId);
    if (!combo) return;

    const select = document.getElementById(`combo-opt-${comboId}`);
    const selectedOption = select.options[select.selectedIndex];
    const basePrice = parseFloat(selectedOption.getAttribute('data-price'));
    const variantName = selectedOption.value;

    const newItem = {
        id: Date.now(), // Unique ID for cart item
        serviceId: combo.id,
        name: `${combo.name} - ${variantName}`,
        type: 'Combo',
        qty: 1,
        unit_price: basePrice,
        base_price: basePrice, // Total for this item
        requiresPostLink: true, // Combos usually need link
        isCombo: true
    };

    cart.push(newItem);
    saveCart();
    updateCartCounter();

    const btn = document.getElementById('floating-cart-btn');
    if (btn) {
        btn.classList.add('scale-110');
        setTimeout(() => btn.classList.remove('scale-110'), 200);
    }
};

function updateCartCounter() {
    const btn = document.getElementById('floating-cart-btn');
    const badge = document.getElementById('cart-badge');

    console.log('updateCartCounter called. Cart length:', cart.length);

    if (!btn || !badge) {
        console.error('Floating cart button or badge not found!');
        return;
    }

    const count = cart.length;
    badge.innerText = count;

    if (count > 0) {
        console.log('Showing floating cart button');
        btn.classList.remove('translate-y-24', 'opacity-0', 'hidden'); // Ensure 'hidden' is also removed if present
        btn.classList.add('translate-y-0', 'opacity-100', 'flex');
    } else {
        console.log('Hiding floating cart button');
        btn.classList.add('translate-y-24', 'opacity-0');
        btn.classList.remove('translate-y-0', 'opacity-100');
        // Optional: add 'hidden' after transition if needed, but transform is usually enough
    }
}

// ... Persistence/Modal logic unchanged ...
function saveFormData() {
    sessionStorage.setItem('ryze_profile_link', profileInput.value);
    sessionStorage.setItem('ryze_post_link', postInput.value);
}

function restoreFormData() {
    const savedProfile = sessionStorage.getItem('ryze_profile_link');
    const savedPost = sessionStorage.getItem('ryze_post_link');
    if (savedProfile) profileInput.value = savedProfile;
    if (savedPost) postInput.value = savedPost;
}

window.openModal = (serviceId, fromCalculator = false) => {
    currentOrderId = Math.floor(10000 + Math.random() * 90000);

    // Reset Coupon State if opening fresh (optional, maybe keep it?)
    // document.getElementById('coupon-input').value = '';
    // const msgEl = document.getElementById('coupon-message');
    // msgEl.classList.add('hidden');
    // msgEl.textContent = '';
    // appliedCoupon = null;

    restoreFormData();

    // Render Cart Items
    const cartContainer = document.getElementById('modal-cart-items');
    if (!cartContainer) {
        // If container doesn't exist yet (we will add it to HTML next), do nothing or generic error
        console.error('Cart container not found');
    } else {
        renderCartItems();
    }

    updateModalPrice();
    validateForm();

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('opacity-0', 'scale-95');
        modalPanel.classList.add('opacity-100', 'scale-100');
    }, 10);
};

function renderCartItems() {
    const container = document.getElementById('modal-cart-items');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-4">Seu carrinho está vazio.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemHtml = `
            <div class="bg-gray-900/50 rounded-xl p-4 border border-brand-purple/20 relative mb-3 group">
                <button onclick="removeFromCart(${index})" class="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div class="pr-6">
                    <p class="text-xs text-brand-purple font-bold uppercase tracking-wider mb-1">${item.type}</p>
                    <p class="text-white font-medium text-sm mb-1">${item.name}</p>
                    <div class="text-lg font-bold text-white">R$ ${item.base_price.toFixed(2).replace('.', ',')}</div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    updateModalPrice();
    validateForm();
    updateCartCounter(); // Added this call
};

window.closeModal = () => {
    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.add('opacity-0', 'scale-95');
    modalPanel.classList.remove('opacity-100', 'scale-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        currentService = null;
        currentOrderId = null;
    }, 300);
};

function updateModalPrice() {
    if (cart.length === 0) {
        document.getElementById('modal-service-price').textContent = 'R$ 0,00';
        document.getElementById('modal-service-name').textContent = 'Seu carrinho está vazio'; // Or hide it
        return;
    }

    // Calculate Subtotal
    let subtotal = cart.reduce((acc, item) => acc + item.base_price, 0);

    // Apply Loyalty Discount
    const userLevel = getUserLevel();
    const discountPercent = descontos[userLevel] || 0;
    const loyaltyDiscount = subtotal * discountPercent;

    let total = subtotal - loyaltyDiscount;

    // Apply Coupon Discount (on top of loyalty? or on subtotal? Logic said "on top of loyalty" in previous code)
    // Previous code: finalPrice = finalPrice * (1 - appliedCoupon.discount);
    let couponDiscountAmount = 0;
    if (appliedCoupon) {
        const afterLoyalty = total;
        total = total * (1 - appliedCoupon.discount);
        couponDiscountAmount = afterLoyalty - total;
    }

    // Update UI
    const priceEl = document.getElementById('modal-service-price');
    const nameEl = document.getElementById('modal-service-name');

    // Show discount details if any
    let priceHtml = '';
    if (loyaltyDiscount > 0 || couponDiscountAmount > 0) {
        priceHtml += `<span class="text-sm text-gray-400 line-through block">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>`;
        if (loyaltyDiscount > 0) {
            priceHtml += `<span class="text-xs text-yellow-500 block">Desconto ${userLevel.toUpperCase()} (${(discountPercent * 100).toFixed(0)}%): -R$ ${loyaltyDiscount.toFixed(2).replace('.', ',')}</span>`;
        }
        if (couponDiscountAmount > 0) {
            priceHtml += `<span class="text-xs text-green-500 block">Cupom: -R$ ${couponDiscountAmount.toFixed(2).replace('.', ',')}</span>`;
        }
        priceHtml += `<span class="text-2xl font-bold text-green-500">R$ ${total.toFixed(2).replace('.', ',')}</span>`;
    } else {
        priceHtml = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    priceEl.innerHTML = priceHtml;

    nameEl.innerHTML = `
        <div class="flex flex-col gap-1">
            <span>Resumo do Pedido (${cart.length} itens)</span>
        </div>
    `;

    renderLoyaltyCard();
}

function renderLoyaltyCard() {
    const container = document.getElementById('loyalty-card-container');
    if (!container) return;

    const totalSpent = getUserTotalSpent();
    const currentLevel = getUserLevel(); // bronze, prata, ouro

    let nextLevel = '';
    let nextThreshold = 0;
    let progress = 0;
    let accentColor = '';
    let badgeClass = '';
    let badgeGlow = '';

    if (currentLevel === 'bronze') {
        nextLevel = 'PRATA';
        nextThreshold = 100;
        progress = (totalSpent / 100) * 100;
        accentColor = 'text-amber-500'; // Text/Icon color
        badgeClass = 'bg-amber-600 text-white';
        badgeGlow = 'shadow-[0_0_15px_rgba(217,119,6,0.6)]'; // Amber glow
    } else if (currentLevel === 'prata') {
        nextLevel = 'OURO';
        nextThreshold = 500;
        // Progress from 100 to 500
        progress = ((totalSpent - 100) / (500 - 100)) * 100;
        accentColor = 'text-gray-300';
        badgeClass = 'bg-gray-500 text-white';
        badgeGlow = 'shadow-[0_0_15px_rgba(156,163,175,0.6)]'; // Gray glow
    } else {
        // Gold
        nextLevel = 'MAX';
        nextThreshold = totalSpent; // Full
        progress = 100;
        accentColor = 'text-yellow-500';
        badgeClass = 'bg-yellow-500 text-black';
        badgeGlow = 'shadow-[0_0_15px_rgba(234,179,8,0.6)]'; // Yellow glow
    }

    // Clamp progress
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    const remaining = nextThreshold - totalSpent;
    const remainingText = currentLevel === 'ouro'
        ? 'Você chegou ao nível máximo! Aproveite 10% OFF.'
        : `Faltam R$ ${remaining.toFixed(2).replace('.', ',')} para subir de nível.`;

    // Custom Icon for Trophy based on level?
    // Let's use a generic Crown or Trophy icon and color it.
    const trophyIcon = `
    <svg class="w-5 h-5 mr-2 ${accentColor}" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 3L2 9L12 15L22 9L19 3H5ZM12 17L5 12H2V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V12H19L12 17Z" />
    </svg>`;

    const html = `
        <div class="border border-gray-800 bg-[#1a1a1a] rounded-xl p-4 mb-4 relative overflow-hidden">

            <div class="flex justify-between items-center mb-3 relative z-10">
                <div class="flex items-center">
                    ${trophyIcon}
                    <span class="font-bold text-lg ${accentColor}">Seu Nível</span>
                    <div class="group relative ml-2">
                        <svg class="w-4 h-4 opacity-50 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black text-xs text-white p-2 rounded hidden group-hover:block z-50">
                            Bronze: 0% OFF<br>Prata: 3% OFF (>R$100)<br>Ouro: 10% OFF (>R$500)
                        </div>
                    </div>
                </div>
                <span class="${badgeClass} ${badgeGlow} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center transition-shadow duration-300 text-white shadow-sm">
                    ${currentLevel === 'bronze' ? '🥉' : currentLevel === 'prata' ? '🥈' : '🥇'} ${currentLevel}
                </span>
            </div>

            <div class="w-full bg-gray-700/50 rounded-full h-2.5 mb-2 relative overflow-hidden">
                <div class="${badgeClass.split(' ')[0]} h-2.5 rounded-full transition-all duration-1000 ease-out relative" style="width: ${progress}%">
                    <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>

            <p class="text-sm ${accentColor} font-medium">${remainingText}</p>
        </div>
    `;

    container.innerHTML = html;
}

function validateForm() {
    // if cart is empty, disable
    if (cart.length === 0) {
        finalizeOrderBtn.disabled = true;
        finalizeOrderBtn.classList.add('grayscale', 'cursor-not-allowed', 'opacity-50');
        return;
    }

    const profileValue = profileInput.value.trim();
    const postValue = postInput.value.trim();
    saveFormData();

    const isProfileValid = profileValue.length > 0 && (profileValue.includes('@') || profileValue.includes('http') || profileValue.includes('www'));

    // Check if ANY item in cart requires post link
    const needsPostLink = cart.some(item => item.requiresPostLink);
    let isPostValid = true;

    const postLabel = document.querySelector('label[for="post-link"]');
    if (needsPostLink) {
        postLabel.innerHTML = `Link do Post <span class="text-red-500">*</span> (Necessário para alguns itens)`;
        isPostValid = postValue.length > 0 && (postValue.includes('http') || postValue.includes('www'));
    } else {
        postLabel.innerHTML = `Link do Post <span class="text-gray-500 text-xs">(Opcional)</span>`;
    }

    // Check Terms Checkbox (will implement in HTML next)
    const termsCheckbox = document.getElementById('terms-checkbox');
    const isTermsAccepted = termsCheckbox ? termsCheckbox.checked : false;

    if (isProfileValid && isPostValid && isTermsAccepted) {
        finalizeOrderBtn.disabled = false;
        finalizeOrderBtn.classList.remove('grayscale', 'cursor-not-allowed', 'opacity-50');
    } else {
        finalizeOrderBtn.disabled = true;
        finalizeOrderBtn.classList.add('grayscale', 'cursor-not-allowed', 'opacity-50');
    }
}

function setupEventListeners() {
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    profileInput.addEventListener('input', validateForm);
    postInput.addEventListener('input', validateForm);

    // Add Terms Checkbox Listener (will be added to DOM later, but we can bind to body for delegation or wait)
    // Actually, better to add it here, but element might not exist yet if JS runs before HTML update?
    // Init runs on DOMContentLoaded so it should be fine IF the HTML is there.
    // Since I haven't updated HTML yet, I'll add a safety check or delegate.

    // Delegate to body for dynamic elements or elements added later? 
    // No, standard listener is fine if I update HTML first. 
    // But I am updating JS first. I will add a check in validateForm and add the listener to the checkbox
    // in a separate logic or assume it will be called after HTML update.
    // I'll add the listener IF element exists, or I can add it to the init function later? 
    // Let's rely on validateForm being called on change.

    // Apply Coupon
    applyCouponBtn.addEventListener('click', () => {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        const messageEl = document.getElementById('coupon-message');
        if (code === 'BEMVINDO') {
            appliedCoupon = { code: 'BEMVINDO', discount: 0.10 };
            messageEl.textContent = 'Desconto de 10% aplicado! 🎉';
            messageEl.classList.remove('text-red-500', 'hidden');
            messageEl.classList.add('text-green-500');
            updateModalPrice();
        } else {
            messageEl.textContent = 'Cupom inválido ❌';
            messageEl.classList.remove('text-green-500', 'hidden');
            messageEl.classList.add('text-red-500');
            appliedCoupon = null;
            updateModalPrice();
        }
    });

    finalizeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0 || finalizeOrderBtn.disabled) return;

        finalizeOrderBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando Pedido...
        `;

        const profileLink = profileInput.value.trim();
        const postLink = postInput.value.trim();

        // Calculate Totals for Message
        let subtotal = cart.reduce((acc, item) => acc + item.base_price, 0);
        const userLevel = getUserLevel();
        const discountPercent = descontos[userLevel] || 0;
        const loyaltyDiscount = subtotal * discountPercent;
        let total = subtotal - loyaltyDiscount;
        if (appliedCoupon) total = total * (1 - appliedCoupon.discount);

        // Update User Spending (Optimistic update or wait for successful payment? Usually independent for now)
        // Ideally should be updated after payment confirmation, but since this is manual, we track it here?
        // Or maybe just track it. Let's track it here for now as "Assumed paid" or we can't really track it without backend.
        // The prompt says "persists user spending data using `localStorage`".
        updateUserTotalSpent(total);

        // Construct Message
        let itemsList = cart.map((item, i) => {
            return `${i + 1}. *${item.name}* (${item.type})\n   Link: ${item.requiresPostLink ? postLink : profileLink}`;
        }).join('\n');

        const message = `*NOVO PEDIDO RYZE* 🚀\n*Pedido #:* ${currentOrderId}\n------------------\n${itemsList}\n------------------\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n*Desconto Fidelidade (${userLevel.toUpperCase()}):* -R$ ${loyaltyDiscount.toFixed(2).replace('.', ',')}\n*Total a Pagar:* R$ ${total.toFixed(2).replace('.', ',')}\n\n*Perfil:* ${profileLink}\n${postLink ? `*Post:* ${postLink}\n` : ''}\nAguardo a chave Pix!`;

        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://api.whatsapp.com/send?phone=${MEU_WHATSAPP}&text=${encodedMessage}`;

        // Clear Cart
        cart = [];
        saveCart();

        window.open(waLink, '_blank');
        closeModal();
        finalizeOrderBtn.innerHTML = `Finalizar Compra no WhatsApp`;
    });
}

// --- COMBOS LOGIC ---

function renderComboTabs() {
    const container = document.getElementById('combos-tabs-container');
    const comboPlatforms = platforms.filter(p => combosData[p.id]);

    container.innerHTML = comboPlatforms.map(p => `
        <button
            onclick="switchComboTab('${p.id}')"
            class="px-5 py-2 rounded-xl font-bold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border
            ${currentComboPlatform === p.id
            ? `${p.color} bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border-transparent`
            : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}">
            ${p.icon}
            ${p.name}
        </button>
    `).join('');
}

window.switchComboTab = (platformId) => {
    currentComboPlatform = platformId;
    renderComboTabs();

    const grid = document.getElementById('combos-grid');
    // Also animate dropdown container if exists
    const mobileComboSelector = document.getElementById('mobile-combos-selector');
    if (mobileComboSelector) mobileComboSelector.classList.add('opacity-0', 'translate-y-4');

    grid.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
        renderCombos(platformId);
        grid.classList.remove('opacity-0', 'translate-y-4');
        grid.classList.add('transition-all', 'duration-500');
        if (mobileComboSelector) {
            mobileComboSelector.classList.remove('opacity-0', 'translate-y-4');
            mobileComboSelector.classList.add('transition-all', 'duration-500');
        }
    }, 200);
}

function renderCombos(platformId) {
    const grid = document.getElementById('combos-grid');
    const combos = combosData[platformId] || [];

    // Clear grid first
    grid.innerHTML = '';

    // Remove existing mobile selector if any
    const existingSelector = document.getElementById('mobile-combos-selector');
    if (existingSelector) existingSelector.remove();

    if (combos.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10"><p class="text-gray-500">Nenhum combo disponível para esta plataforma.</p></div>`;
        return;
    }

    // --- MOBILE SELECTOR LOGIC ---
    const mobileSelectorHtml = `
        <div id="mobile-combos-selector" class="md:hidden w-full max-w-md mx-auto mb-8 px-4">
            <label class="block text-center text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">SELECIONE O COMBO:</label>
            <div class="relative">
                <select id="mobile-combo-select" onchange="toggleMobileCombo(this.value)" class="block w-full rounded-xl border border-gray-700 bg-[#1a1a1a] text-white py-3 pl-4 pr-10 shadow-lg focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-base appearance-none outline-none font-bold">
                    ${combos.map((s, index) => `<option value="${s.id}" ${index === 0 ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-purple">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    `;

    // Insert selector before the grid
    grid.insertAdjacentHTML('beforebegin', mobileSelectorHtml);

    // Render Combo Cards
    const cardsHtml = combos.map((combo, index) => {
        const mobileClass = index === 0 ? 'block' : 'hidden';

        const initialOption = combo.options[0];
        const initialPrice = initialOption.price.toFixed(2).replace('.', ',');

        // Badges HTML
        const badgesHtml = combo.badges.map(b => {
            let colorClass = 'bg-gray-800 text-gray-300';
            let icon = '';
            if (b === 'PARA PERFIL' || b === 'POPULAR' || b === 'VIP') {
                colorClass = 'bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-md uppercase text-[10px] font-bold shadow-lg shadow-green-500/20';
            }
            if (b === 'Máxima Qualidade') {
                colorClass = 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30 flex items-center gap-1 px-2 py-0.5 rounded-full';
                icon = '<span class="text-[10px]">💎</span>';
            }
            return `<span class="inline-flex items-center text-xs font-bold ${colorClass}">${icon}${b}</span>`;
        }).join('');

        return `
        <div class="combo-card-item bg-brand-card rounded-2xl p-8 border border-brand-border hover:border-brand-purple transition-all group relative overflow-hidden flex flex-col h-full transform hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)] ${mobileClass} md:block md:w-full" id="combo-card-${combo.id}">
            
            <div class="flex flex-wrap items-center gap-2 mb-6">
                ${badgesHtml}
            </div>

            <h3 class="font-bold text-white text-2xl mb-2 text-left">${combo.name}</h3>
            <p class="text-gray-500 text-sm mb-6 text-left">Escolha a opção ideal para você:</p>

            <!-- Dropdown -->
            <div class="mb-8 relative z-20">
                <select id="combo-opt-${combo.id}" onchange="updateComboPrice('${combo.id}')" 
                    class="block w-full rounded-xl border-gray-700 bg-[#1a1a1a] text-white py-4 pl-4 pr-10 shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple sm:text-sm cursor-pointer hover:bg-[#222] transition-colors font-medium appearance-none outline-none">
                    ${combo.options.map(opt => `<option value="${opt.name}" data-price="${opt.price}">${opt.name} - R$ ${opt.price.toFixed(2).replace('.', ',')}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            <!-- Benefits -->
            <ul class="space-y-4 mb-10 flex-grow text-left">
                ${combo.benefits.map(b => `
                    <li class="flex items-center gap-3 text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                        <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        ${b}
                    </li>
                `).join('')}
            </ul>

            <!-- Button -->
            <button
                onclick="addComboToCart('${combo.id}', '${platformId}')"
                class="w-full bg-transparent border border-gray-600 text-white hover:text-white font-bold py-4 px-4 rounded-xl hover:bg-brand-purple hover:border-brand-purple transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-brand-purple/25">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Adicionar ao Carrinho
            </button>
        </div>
        `;
    }).join('');

    grid.innerHTML = cardsHtml;
}

// Global function to toggle combo visibility on mobile
window.toggleMobileCombo = (selectedComboId) => {
    const allCards = document.querySelectorAll('.combo-card-item');
    allCards.forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('block');
    });
    const selectedCard = document.getElementById(`combo-card-${selectedComboId}`);
    if (selectedCard) {
        selectedCard.classList.remove('hidden');
        selectedCard.classList.add('block');
    }
};

window.updateComboPrice = (comboId) => {
    // Only functionality needed is handled by select.
};

window.addComboToCart = (comboId, platformId) => {
    const combo = combosData[platformId].find(c => c.id === comboId);
    if (!combo) return;

    const select = document.getElementById(`combo-opt-${comboId}`);
    const selectedOption = select.options[select.selectedIndex];
    const basePrice = parseFloat(selectedOption.getAttribute('data-price'));
    const variantName = selectedOption.value;

    const newItem = {
        id: Date.now(), // Unique ID for cart item
        serviceId: combo.id,
        name: `${combo.name} - ${variantName}`,
        type: 'Combo',
        qty: 1,
        unit_price: basePrice,
        base_price: basePrice, // Total for this item
        requiresPostLink: true, // Combos usually need link
        isCombo: true
    };

    cart.push(newItem);
    saveCart();
    updateCartCounter();

    // Show visual feedback on floating button
    const btn = document.getElementById('floating-cart-btn');
    if (btn) {
        btn.classList.add('scale-110');
        setTimeout(() => btn.classList.remove('scale-110'), 200);
    }
};

// Duplicate updateCartCounter removed


// Run
function openInfoModal(text) {
    const modal = document.getElementById('info-modal');
    const modalText = document.getElementById('info-modal-text');
    if (!modal || !modalText) return;

    modalText.textContent = text;
    modal.classList.remove('hidden');
    // Animate in
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    modal.firstElementChild.classList.remove('scale-100');
    modal.firstElementChild.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Close on click outside
document.getElementById('info-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-modal') closeInfoModal();
});
// Run
function openInfoModal(text) {
    const modal = document.getElementById('info-modal');
    const modalText = document.getElementById('info-modal-text');
    if (!modal || !modalText) return;

    modalText.textContent = text;
    modal.classList.remove('hidden');
    // Animate in
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    modal.firstElementChild.classList.remove('scale-100');
    modal.firstElementChild.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Close on click outside
document.getElementById('info-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-modal') closeInfoModal();
});
// Terms Modal Logic
window.openTermsModal = () => {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    // Animate in
    setTimeout(() => {
        modal.firstElementChild.classList.remove('opacity-0'); // backdrop
        modal.lastElementChild.firstElementChild.firstElementChild.classList.remove('opacity-0', 'scale-95'); // panel
        modal.lastElementChild.firstElementChild.firstElementChild.classList.add('opacity-100', 'scale-100');
    }, 10);
}

window.closeTermsModal = () => {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;

    modal.firstElementChild.classList.add('opacity-0');
    modal.lastElementChild.firstElementChild.firstElementChild.classList.add('opacity-0', 'scale-95');
    modal.lastElementChild.firstElementChild.firstElementChild.classList.remove('opacity-100', 'scale-100');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

document.addEventListener('DOMContentLoaded', init);

/* ========================================
   MOBILE MENU LOGIC
   ======================================== */
window.toggleMobileMenu = () => {
    const sidebar = document.getElementById('mobile-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');

    if (!sidebar || !backdrop) return;

    if (sidebar.classList.contains('translate-x-full')) {
        // OPEN MENU
        sidebar.classList.remove('translate-x-full');

        backdrop.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
        }, 10);

        document.body.style.overflow = 'hidden';
    } else {
        // CLOSE MENU
        sidebar.classList.add('translate-x-full');

        backdrop.classList.add('opacity-0');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            backdrop.classList.add('hidden');
        }, 300);

        document.body.style.overflow = '';
    }
};
