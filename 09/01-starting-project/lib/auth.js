import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "@/lib/db";
import { cookies } from "next/headers";

// Настройка адаптера для работы Lucia с базой данных SQLite через better-sqlite3.
// Указываем таблицы, которые используются для хранения пользователей и их сессий.
const adapter = new BetterSqlite3Adapter(db, {
    user: "users", // Имя таблицы пользователей в БД
    session: "sessions", // Имя таблицы сессий в БД
});

// Инициализация основного объекта Lucia для управления аутентификацией
const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false, // Файлы cookie не удаляются при закрытии браузера (их жизненным циклом управляет Lucia)
        attributes: {
            // Флаг secure=true включается только в продакшене, чтобы файлы cookie передавались исключительно по HTTPS
            secure: process.env.NODE_ENV === "production",
        },
    },
});

/**
 * Создает новую сессию для пользователя и сохраняет токен в файлы cookie браузера.
 * @param {string} userId - Идентификатор пользователя из базы данных
 */
export async function createAuthSession(userId) {
    // 1. Создаем запись о сессии в базе данных через Lucia
    const session = await lucia.createSession(userId, {});

    // 2. Генерируем параметры cookie (имя, значение, атрибуты) на основе ID созданной сессии
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 3. Устанавливаем cookie в браузер пользователя
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

/**
 * Проверяет валидность текущей сессии пользователя по его файлам cookie.
 * Обновляет устаревающие сессии или удаляет невалидные cookie.
 * @returns {Promise<{user: Object|null, session: Object|null}>}
 */
export async function verifyAuth() {
    // 1. Пытаемся получить cookie сессии по имени, которое задано в конфигурации Lucia
    const sessionCookie = cookies().get(lucia.sessionCookieName);

    // Если cookie отсутствует, пользователь точно не авторизован
    if (!sessionCookie) {
        return { user: null, session: null };
    }

    // 2. Получаем ID сессии из значения cookie
    const sessionId = sessionCookie.value;
    if (!sessionId) {
        return { user: null, session: null };
    }

    // 3. Проверяем ID сессии по базе данных с помощью Lucia
    // Метод возвращает объект { user, session }
    const result = await lucia.validateSession(sessionId);

    try {
        // Если сессия валидна, но её срок жизни подходит к концу (fresh === true),
        // Lucia рекомендует продлить её и выдать пользователю обновленный cookie.
        if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }

        // Если сессия невалидна (например, удалена из БД или истекла),
        // очищаем недействительный cookie в браузере пользователя (создаем пустой cookie).
        if (!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch {
        // Игнорируем ошибки установки cookie, если они вызваны особенностями окружения Next.js
        // (например, при попытке изменить cookie внутри Server Components во время рендеринга страницы)
    }

    // Возвращаем результат проверки: { user, session } или { user: null, session: null }
    return result;
}

export async function destroySession() {
    const { session } = await verifyAuth();
    if (!session) {
        return {
            error: "Unauthorized!",
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}
