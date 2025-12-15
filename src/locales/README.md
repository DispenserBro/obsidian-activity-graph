# Localization / Локализация

This directory contains all language translations for the Activity Graph plugin.

Эта директория содержит переводы для плагина Activity Graph.

## 📁 Structure / Структура

```
locales/
├── index.js      # Locale registry and loader
├── en.js         # English translations
├── ru.js         # Russian translations
└── README.md     # This file
```

## 🌍 Adding a New Language / Добавление нового языка

### English Instructions

**Step 1: Create locale file**

1. Copy the English file:
   ```bash
   cp en.js your-language-code.js
   ```
   Examples: `de.js` (German), `fr.js` (French), `zh.js` (Chinese)

2. Open the new file and change the export name:
   ```javascript
   export const STRINGS_DE = {  // Change EN to your language code
   ```

3. Translate all **values** (keep the keys unchanged):
   ```javascript
   // ✅ Correct
   viewTitle: 'Aktivitätsgraph',
   
   // ❌ Wrong - don't translate keys!
   ansichtsTitel: 'Aktivitätsgraph',
   ```

**Step 2: Register your language**

Edit `index.js` and add your language:

```javascript
// 1. Add import at the top
import { STRINGS_DE } from './de.js';

// 2. Add to TRANSLATIONS object
const TRANSLATIONS = {
    en: STRINGS_EN,
    ru: STRINGS_RU,
    de: STRINGS_DE  // Add here
};

// 3. Add to AVAILABLE_LOCALES array
const AVAILABLE_LOCALES = ['en', 'ru', 'de'];  // Add here
```

**Step 3: Test**

1. Build: `npm run build`
2. Change Obsidian language to your language code
3. Restart Obsidian
4. Verify all UI elements are translated

---

### Русские инструкции

**Шаг 1: Создать файл локали**

1. Скопируйте английский файл:
   ```bash
   cp en.js код-языка.js
   ```
   Примеры: `de.js` (немецкий), `fr.js` (французский), `zh.js` (китайский)

2. Откройте новый файл и измените имя экспорта:
   ```javascript
   export const STRINGS_DE = {  // Замените EN на код вашего языка
   ```

3. Переведите все **значения** (ключи оставьте без изменений):
   ```javascript
   // ✅ Правильно
   viewTitle: 'Aktivitätsgraph',
   
   // ❌ Неправильно - не переводите ключи!
   ansichtsTitel: 'Aktivitätsgraph',
   ```

**Шаг 2: Зарегистрировать язык**

Отредактируйте `index.js` и добавьте ваш язык:

```javascript
// 1. Добавьте импорт в начало файла
import { STRINGS_DE } from './de.js';

// 2. Добавьте в объект TRANSLATIONS
const TRANSLATIONS = {
    en: STRINGS_EN,
    ru: STRINGS_RU,
    de: STRINGS_DE  // Добавьте сюда
};

// 3. Добавьте в массив AVAILABLE_LOCALES
const AVAILABLE_LOCALES = ['en', 'ru', 'de'];  // Добавьте сюда
```

**Шаг 3: Протестировать**

1. Собрать: `npm run build`
2. Изменить язык Obsidian на ваш язык
3. Перезапустить Obsidian
4. Проверить, что все элементы UI переведены

## 📝 Translation Guidelines / Руководство по переводу

### Important Rules / Важные правила

✅ **DO / ДЕЛАЙТЕ:**
- Keep all keys in English (left side of `:`)
- Translate only values (right side of `:`)
- Preserve array structures exactly
- Test before submitting

❌ **DON'T / НЕ ДЕЛАЙТЕ:**
- Don't translate keys
- Don't change array sizes
- Don't use machine translation without review

### Special Keys / Специальные ключи

**Arrays** - must maintain exact element count:
```javascript
monthsFull: ['January', ..., 'December'],    // 12 elements
monthsShort: ['Jan', ..., 'Dec'],            // 12 elements  
daysShort: ['Sun', 'Mon', ..., 'Sat'],       // 7 elements (start Sunday!)
```

**Interpolation** - preserve `%{variable}` placeholders:
```javascript
notesCount: '%{count} notes'  // Keep %{count} unchanged
```

## 🎯 Currently Supported / Поддерживаемые языки

- 🇬🇧 English (`en`) - Default
- 🇷🇺 Russian (`ru`)

## 🤝 Contributing / Участие

**No programming knowledge required!** Just:

1. Fork the repository
2. Copy `en.js` to `[language].js`
3. Translate values
4. Update `index.js`
5. Submit Pull Request

**Знания программирования не требуются!** Просто:

1. Сделайте fork репозитория
2. Скопируйте `en.js` в `[язык].js`
3. Переведите значения
4. Обновите `index.js`
5. Отправьте Pull Request

🎉 We appreciate all contributions!
