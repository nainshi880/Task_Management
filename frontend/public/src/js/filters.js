import { setFilter, setSearch, getCurrentFilter } from './tasks.js';

export const initFilters = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const status = btn.getAttribute('data-status');
      setFilter(status);
    });
  });

  const searchInput = document.getElementById('searchInput');
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
  });
};
