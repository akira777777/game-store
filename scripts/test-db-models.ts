/**
 * Скрипт для проверки работы обеих моделей базы данных (SQLite и PostgreSQL)
 */

import 'dotenv/config';

async function testDatabase() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL не установлен');
    process.exit(1);
  }

  const isPostgreSQL = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
  const isSQLite = dbUrl.startsWith('file:');

  console.log(`\n📊 Проверка подключения к базе данных:`);
  console.log(`   Тип: ${isPostgreSQL ? 'PostgreSQL' : isSQLite ? 'SQLite' : 'Неизвестный'}`);
  console.log(`   URL: ${dbUrl.substring(0, 50)}...\n`);

  try {
    // Импортируем db из lib/db.ts
    const { db } = await import('../lib/db');

    console.log('🔄 Подключение к базе данных...');
    await db.$connect();
    console.log('✅ Подключение успешно!\n');

    // Простой запрос для проверки
    console.log('🔄 Выполнение тестового запроса...');
    const userCount = await db.user.count();
    console.log(`✅ База данных работает! Количество пользователей: ${userCount}\n`);

    await db.$disconnect();
    console.log('✅ Отключение от базы данных успешно\n');

    return true;
  } catch (error: any) {
    console.error('❌ Ошибка при работе с базой данных:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

testDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
