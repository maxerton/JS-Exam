'use strict'

document.querySelectorAll('i[data-action="fa-hover"]').forEach(elem => {elem.addEventListener('mouseover', (ev) => ev.target.classList.add('fa-beat')); elem.addEventListener('mouseout', ev=>ev.target.classList.remove('fa-beat'))});

document.querySelector('.library-navs').addEventListener('wheel', e => e.target.closest('.library-navs').scrollLeft += e.deltaY / 3) 

