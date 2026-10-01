/**
 * Tournament utilities for GLP Esport Stadium
 * Provides unified sorting, status detection, and prioritization
 */

/**
 * Returns numeric priority for tournament display order:
 * 1 = Open for registration (อันที่เปิดรับสมัคร - แสดงบนสุด)
 * 2 = Upcoming / Coming soon (เร็วๆ นี้ - แสดงถัดมา)
 * 3 = Other default
 * 4 = Full / Closed / Completed (อันที่ปิดแล้ว / เต็มแล้ว / แข่งเสร็จแล้ว - นำไปไว้หลังๆ)
 */
export function getTournamentSortPriority(t) {
  if (!t) return 99;
  const status = (t.status || '').toLowerCase().trim();
  const badge = (t.badge || '').toLowerCase().trim();

  // 1. Open for registration: "อันที่สมัครแข่ง ขึ้นมาไว้บนสุด"
  if (status === 'open' || badge.includes('รับสมัคร') || badge.includes('เปิดรับ')) {
    return 1;
  }

  // 2. Upcoming / Soon
  if (status === 'upcoming' || badge.includes('เร็วๆ') || badge.includes('coming') || badge.includes('เตรียมพบ')) {
    return 2;
  }

  // 4. Closed / Full / Finished / Completed: "อันไหนที่ปิดไปแล้ว เอาไปหลังๆ"
  if (
    status === 'full' || 
    status === 'closed' || 
    status === 'completed' || 
    status === 'finished' ||
    badge.includes('เต็ม') || 
    badge.includes('ปิด') || 
    badge.includes('จบ') ||
    badge.includes('เสร็จ')
  ) {
    return 4;
  }

  // 3. Other default
  return 3;
}

/**
 * Checks if tournament is currently accepting registrations
 */
export function isTournamentRegistrationOpen(t) {
  if (!t) return false;
  const status = (t.status || '').toLowerCase().trim();
  const badge = (t.badge || '').toLowerCase().trim();
  return status === 'open' || badge.includes('รับสมัคร') || badge.includes('เปิดรับ');
}

/**
 * Sort comparator to ensure:
 * - Open tournaments appear first
 * - Upcoming tournaments in middle
 * - Closed / Full tournaments appear at the very back
 */
export function compareTournaments(a, b) {
  const pA = getTournamentSortPriority(a);
  const pB = getTournamentSortPriority(b);
  if (pA !== pB) {
    return pA - pB;
  }
  return 0; // Maintain stable order for same priority
}
