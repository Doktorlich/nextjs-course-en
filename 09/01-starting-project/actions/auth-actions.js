"use server"; // Указывает Next.js, что все функции в этом файле являются Server Actions и выполняются только на сервере

import { createUser, getUserByEmail } from "../lib/user";
import { hashUserPassword, verifyPassword } from "../lib/hash";
import { redirect } from "next/navigation";
import { createAuthSession, destroySession } from "@/lib/auth";

/**
 * Server Action для регистрации нового пользователя.
 * @param {Object} prevState - Предыдущее состояние формы (используется вместе с хуком useActionState / useFormState)
 * @param {FormData} formData - Данные формы, отправленные пользователем
 */
export async function signup(prevState, formData) {
    // Извлекаем значения полей из объекта formData
    const email = formData.get("email");
    const password = formData.get("password");

    // Объект для сбора ошибок валидации
    let errors = {};

    // 1. Валидация корректности формата Email
    if (!email.includes("@")) {
        errors.email = "Please enter a valid email address.";
    }

    // 2. Валидация длины пароля (минимум 8 символов после удаления пробелов)
    if (password.trim().length <= 8) {
        errors.password = "Password must be at least 8 characters long.";
    }

    // Если обнаружены ошибки валидации, возвращаем их для отображения в интерфейсе
    if (Object.keys(errors).length > 0) {
        return {
            errors: errors,
        };
    }

    // Хешируем пароль перед сохранением в базу данных для безопасности
    const hashedPassword = hashUserPassword(password);

    try {
        // 1. Создаем пользователя в базе данных и получаем его уникальный ID
        const id = createUser(email, hashedPassword);

        // 2. Создаем сессию аутентификации и устанавливаем cookie в браузер
        await createAuthSession(id);

        // 3. Перенаправляем пользователя на закрытую страницу после успешной регистрации
        // ВАЖНО: Вызов redirect() внутри try/catch может быть перехвачен блоком catch,
        // так как Next.js использует внутренний механизм ошибок для прерывания выполнения.
        redirect("/training");
    } catch (error) {
        // Проверяем, является ли ошибка внутренней ошибкой перенаправления Next.js.
        // Если это так, пробрасываем её дальше, чтобы редирект сработал корректно.
        if (error.message === "NEXT_REDIRECT") {
            throw error;
        }

        // Обработка ошибки уникальности SQLite (если пользователь с таким Email уже зарегистрирован)
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return {
                errors: {
                    email: "It seems like an account for the chosen email already exists.",
                },
            };
        }

        // Любые другие непредвиденные ошибки выбрасываем наружу
        throw error;
    }
}

export async function login(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const existingUser = getUserByEmail(email);

    if (!existingUser) {
        return {
            errors: {
                email: "Could not authenticate user, please check your credentials.",
            },
        };
    }

    const isValidPassword = verifyPassword(existingUser.password, password);
    if (!isValidPassword) {
        return {
            errors: {
                password: "Could not authenticate user, please check your credentials.",
            },
        };
    }

    await createAuthSession(existingUser.id);
    redirect("/training");
}

export async function auth(mode, prevState, formData) {
    if (mode === "login") {
        return login(prevState, formData);
    }
    return signup(prevState, formData);
}

export async function logout() {
    await destroySession();
    redirect("/");
}
