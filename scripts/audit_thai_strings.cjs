const fs = require('fs');
const path = require('path');

const publicFiles = [
  'src/App.jsx',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
  'src/components/AnnouncementTicker.jsx',
  'src/components/LanguageSelector.jsx',
  'src/components/AIChatWidget.jsx',
  'src/components/ArenaHub.jsx',
  'src/components/TournamentsPage.jsx',
  'src/components/TournamentOverviewSlider.jsx',
  'src/components/TournamentDetailModal.jsx',
  'src/components/SingleTournamentView.jsx',
  'src/components/ActivitiesPage.jsx',
  'src/components/SingleActivityView.jsx',
  'src/components/CompanyProfile.jsx',
  'src/components/FranchisePlanner.jsx',
  'src/components/ContactPage.jsx',
  'src/components/EsportOrganizerModal.jsx',
  'src/components/ArenaSeatBookingModal.jsx',
  'src/components/SocialSharePopover.jsx',
  'src/components/Room3DStudio.jsx'
];

const thaiRegex = /[\u0E00-\u0E7F]+/g;

console.log('--- SCANNING FOR UNTRANSLATED THAI STRINGS ---');

let totalIssues = 0;
const resultsByFile = {};

for (const relPath of publicFiles) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const fileIssues = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    
    // Check if line contains Thai
    if (/[\u0E00-\u0E7F]/.test(line)) {
      // Check if it's already wrapped in t(...) or translateDynamic(...) or in a translation map
      const isWrapped = /t\s*\(\s*['"`]/.test(line) || 
                        /translateDynamic\s*\(/.test(line) ||
                        /autoTranslateDynamic\s*\(/.test(line) ||
                        /['"]th['"]\s*:/.test(line) ||
                        /language\s*===?\s*['"]th['"]/.test(line) ||
                        /targetLang\s*===?\s*['"]th['"]/.test(line);

      // If not wrapped or contains suspicious raw text in JSX
      fileIssues.push({
        lineNum: idx + 1,
        text: trimmed.slice(0, 120),
        isWrapped
      });
    }
  });

  resultsByFile[relPath] = fileIssues;
  const unwrapped = fileIssues.filter(i => !i.isWrapped);
  totalIssues += unwrapped.length;
  console.log(`${relPath}: ${fileIssues.length} lines with Thai (${unwrapped.length} unwrapped)`);
}

console.log(`\nTotal unwrapped lines: ${totalIssues}`);

// Write detailed report to scratch file
fs.writeFileSync(
  path.resolve(__dirname, 'thai_audit_report.json'),
  JSON.stringify(resultsByFile, null, 2),
  'utf8'
);
console.log('Saved report to scripts/thai_audit_report.json');
