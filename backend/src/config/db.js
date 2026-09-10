// ─────────────────────────────────────────────────────────────────────────────
// SenseCheck AI — Prisma Client with Resilient In-Memory Fallback
// If DATABASE_URL is provided, connects to real PostgreSQL via Prisma.
// If DATABASE_URL is missing or unavailable, gracefully falls back to an
// in-memory store so the app can be run, demoed, or deployed immediately on Vercel.
// ─────────────────────────────────────────────────────────────────────────────

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

let realPrisma = null;

if (process.env.DATABASE_URL) {
  try {
    const globalForPrisma = globalThis;
    realPrisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = realPrisma;
    }
  } catch (err) {
    console.warn('[DB] PrismaClient initialization warning:', err.message);
    realPrisma = null;
  }
} else {
  console.info('[DB] DATABASE_URL not set — running with in-memory resilient store (no external DB required)');
}

// ─── In-Memory Store (Resilient Fallback) ─────────────────────────────────────
const memoryStore = {
  users: new Map(),
  refreshTokens: new Map(),
  scans: new Map(),
  scanEntities: [],
  threatBlocklist: new Map(),
  scanFeedback: new Map(),
};

// Seed sample threat blocklist for detection demo
memoryStore.threatBlocklist.set('scam-alert@support-sbi.xyz', {
  id: 'b1', type: 'domain', value: 'support-sbi.xyz', notes: 'Fake SBI support domain',
});
memoryStore.threatBlocklist.set('fraud@paytm-verify.com', {
  id: 'b2', type: 'domain', value: 'paytm-verify.com', notes: 'Known phishing domain',
});

const inMemoryPrisma = {
  user: {
    findUnique: async ({ where }) => {
      if (where.email) {
        for (const u of memoryStore.users.values()) {
          if (u.email.toLowerCase() === where.email.toLowerCase()) return { ...u };
        }
      }
      if (where.id) return memoryStore.users.get(where.id) ? { ...memoryStore.users.get(where.id) } : null;
      return null;
    },
    create: async ({ data, select }) => {
      const id = data.id || uuidv4();
      const user = {
        id,
        email: data.email,
        name: data.name || null,
        passwordHash: data.passwordHash,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.users.set(id, user);
      if (select) {
        const res = {};
        for (const k of Object.keys(select)) if (select[k]) res[k] = user[k];
        return res;
      }
      return { ...user };
    },
    update: async ({ where, data }) => {
      const user = memoryStore.users.get(where.id);
      if (!user) return null;
      Object.assign(user, data, { updatedAt: new Date() });
      memoryStore.users.set(where.id, user);
      return { ...user };
    },
  },

  refreshToken: {
    create: async ({ data }) => {
      const id = uuidv4();
      const token = { id, ...data, createdAt: new Date() };
      memoryStore.refreshTokens.set(data.tokenHash, token);
      return token;
    },
    findFirst: async ({ where, include }) => {
      const token = memoryStore.refreshTokens.get(where.tokenHash);
      if (!token) return null;
      if (token.expiresAt < new Date()) return null;
      const res = { ...token };
      if (include?.user) res.user = memoryStore.users.get(token.userId) || null;
      return res;
    },
    deleteMany: async ({ where }) => {
      if (where.userId) {
        for (const [k, v] of memoryStore.refreshTokens.entries()) {
          if (v.userId === where.userId) memoryStore.refreshTokens.delete(k);
        }
      }
      return { count: 1 };
    },
  },

  scan: {
    create: async ({ data }) => {
      const id = data.id || uuidv4();
      const scan = {
        id,
        userId: data.userId || null,
        status: data.status || 'pending',
        inputType: data.inputType,
        pipelineType: data.pipelineType || null,
        cloudinaryPublicId: data.cloudinaryPublicId || null,
        cloudinaryUrl: data.cloudinaryUrl || null,
        language: 'en',
        rawOcrText: data.rawOcrText || null,
        extractedText: null,
        riskScore: null,
        ruleScore: null,
        llmScore: null,
        verdict: null,
        severity: null,
        reasons: [],
        tactics: [],
        recommendations: [],
        urlRisk: null,
        isPublic: false,
        shareToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      memoryStore.scans.set(id, scan);
      return { ...scan };
    },

    findUnique: async ({ where, include }) => {
      let scan = memoryStore.scans.get(where.id);
      if (!scan && where.shareToken) {
        for (const s of memoryStore.scans.values()) {
          if (s.shareToken === where.shareToken) { scan = s; break; }
        }
      }
      if (!scan) return null;
      const res = { ...scan };
      if (include?.entities) {
        res.entities = memoryStore.scanEntities.filter(e => e.scanId === scan.id);
      }
      if (include?.feedback) {
        res.feedback = memoryStore.scanFeedback.get(scan.id) || null;
      }
      return res;
    },

    update: async ({ where, data }) => {
      const scan = memoryStore.scans.get(where.id);
      if (!scan) return null;
      Object.assign(scan, data, { updatedAt: new Date() });
      memoryStore.scans.set(where.id, scan);
      return { ...scan };
    },

    findMany: async ({ where, orderBy, skip = 0, take = 20, select }) => {
      let list = Array.from(memoryStore.scans.values());
      if (where?.userId) list = list.filter(s => s.userId === where.userId);
      if (where?.status) list = list.filter(s => s.status === where.status);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return list.slice(skip, skip + take).map(s => {
        if (!select) return { ...s };
        const res = {};
        for (const k of Object.keys(select)) if (select[k]) res[k] = s[k];
        return res;
      });
    },

    count: async ({ where } = {}) => {
      let list = Array.from(memoryStore.scans.values());
      if (where?.userId) list = list.filter(s => s.userId === where.userId);
      if (where?.status) list = list.filter(s => s.status === where.status);
      if (where?.verdict) list = list.filter(s => s.verdict === where.verdict);
      if (where?.createdAt?.gte) list = list.filter(s => s.createdAt >= where.createdAt.gte);
      return list.length;
    },

    groupBy: async () => {
      const counts = {};
      for (const s of memoryStore.scans.values()) {
        const p = s.pipelineType || 'text_thread';
        counts[p] = (counts[p] || 0) + 1;
      }
      return Object.entries(counts).map(([pipelineType, count]) => ({
        pipelineType,
        _count: { id: count },
      }));
    },
  },

  scanEntity: {
    createMany: async ({ data }) => {
      for (const item of data) {
        memoryStore.scanEntities.push({ id: uuidv4(), ...item, createdAt: new Date() });
      }
      return { count: data.length };
    },
    groupBy: async ({ by }) => {
      const field = by?.[0] || 'value';
      const counts = {};
      for (const e of memoryStore.scanEntities) {
        counts[e[field]] = (counts[e[field]] || 0) + 1;
      }
      return Object.entries(counts).map(([val, count]) => ({
        [field]: val,
        _count: { id: count },
      }));
    },
  },

  threatBlocklist: {
    findFirst: async ({ where }) => {
      const val = (where.value || '').toLowerCase();
      return memoryStore.threatBlocklist.get(val) || null;
    },
    create: async ({ data }) => {
      const id = uuidv4();
      const item = { id, ...data, createdAt: new Date() };
      memoryStore.threatBlocklist.set(data.value.toLowerCase(), item);
      return item;
    },
    count: async () => memoryStore.threatBlocklist.size,
  },

  scanFeedback: {
    create: async ({ data }) => {
      const id = uuidv4();
      const feedback = { id, ...data, createdAt: new Date() };
      memoryStore.scanFeedback.set(data.scanId, feedback);
      return feedback;
    },
  },

  $transaction: async (operations) => {
    if (Array.isArray(operations)) {
      return Promise.all(operations);
    }
    return operations(inMemoryPrisma);
  },
};

// Export proxy: tries real Prisma first if available; falls back to inMemoryPrisma
const dbProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === '$transaction') {
      return async (ops) => {
        if (realPrisma) {
          try { return await realPrisma.$transaction(ops); }
          catch (e) {
            console.warn('[DB] Prisma transaction failed, using memory store fallback:', e.message);
          }
        }
        return inMemoryPrisma.$transaction(ops);
      };
    }

    if (inMemoryPrisma[prop]) {
      return new Proxy(inMemoryPrisma[prop], {
        get(tableTarget, method) {
          return async (...args) => {
            if (realPrisma && realPrisma[prop] && typeof realPrisma[prop][method] === 'function') {
              try {
                return await realPrisma[prop][method](...args);
              } catch (err) {
                console.warn(`[DB] Prisma ${String(prop)}.${String(method)} failed, using fallback:`, err.message);
              }
            }
            if (typeof tableTarget[method] === 'function') {
              return tableTarget[method](...args);
            }
            return null;
          };
        },
      });
    }

    return realPrisma ? realPrisma[prop] : inMemoryPrisma[prop];
  },
});

module.exports = dbProxy;
