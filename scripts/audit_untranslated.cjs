const fs = require('fs');
const path = require('path');

const targetFiles = [
  'TournamentsPage.jsx',
  'SingleTournamentView.jsx',
  'TournamentDetailModal.jsx',
  'ActivitiesPage.jsx',
  'SingleActivityView.jsx',
  'CompanyProfile.jsx',
  'ContactPage.jsx',
  'ArenaHub.jsx',
  'Footer.jsx',
  'Navbar.jsx',
  'AnnouncementTicker.jsx',
  'ProductSpecSheetModal.jsx',
  'EsportOrganizerModal.jsx',
  'ArenaSeatBookingModal.jsx',
  'TournamentOverviewSlider.jsx',
  'AIChatWidget.jsx'
];

const thaiRegex = /[\u0E00-\u0E7F]/;

targetFiles.forEach(fileName => {
  const filePath = path.join('src', 'components', fileName);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const untranslated = [];
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (thaiRegex.test(line)) {
      const isWrapped = line.includes('t(') || line.includes('translateDynamic(') || line.includes('tp(') || line.includes('language ===');
      if (!isWrapped) {
        untranslated.push({ lineNum: idx + 1, text: trimmed });
      }
    }
  });

  console.log(`=== ${fileName}: ${untranslated.length} unwrapped lines ===`);
  untranslated.slice(0, 10).forEach(u => console.log(`  L${u.lineNum}: ${u.text.slice(0, 100)}`));
});
