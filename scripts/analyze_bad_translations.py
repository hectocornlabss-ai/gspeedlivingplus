import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Gspeed\src\context\LanguageContext.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const CONTENT_TRANSLATIONS = {([\s\S]*?)};\n\nexport function', text)
if not m:
    print('CONTENT_TRANSLATIONS not found')
    sys.exit(1)

content = m.group(1)
entries = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)":\s*{\s*en:\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*zh:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*}', content)
print(f'Total parsed entries: {len(entries)}')

thai_regex = re.compile(r'[\u0E00-\u0E7F]')
bad_entries = [e for e in entries if thai_regex.search(e[1]) or thai_regex.search(e[2])]
print(f'Bad entries with Thai in en or zh: {len(bad_entries)}')

with open('scripts/bad_entries.json', 'w', encoding='utf-8') as out:
    json.dump([{'key': e[0], 'en': e[1], 'zh': e[2]} for e in bad_entries], out, ensure_ascii=False, indent=2)

for e in bad_entries[:20]:
    print('KEY:', e[0])
    print('  EN:', e[1][:60])
    print('  ZH:', e[2][:60])
