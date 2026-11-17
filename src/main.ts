import { initNav } from './core/nav';
import { initReveal } from './core/reveal';
import { initDialogs } from './core/dialog';
import { initExperience } from './core/experience';

// Il markup è già nel documento (pre-render): qui si attivano solo i comportamenti.
initNav();
initReveal();
initDialogs();
initExperience();
