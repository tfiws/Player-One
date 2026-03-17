document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const leftBtn = wrapper.querySelector('.carousel-btn.left');
    const rightBtn = wrapper.querySelector('.carousel-btn.right');
    const gameCards = wrapper.querySelector('.game-cards');

    const updateButtons = () => {
        const maxScroll = gameCards.scrollWidth - gameCards.clientWidth;
        const atLeft = gameCards.scrollLeft <= 0;
        const atRight = gameCards.scrollLeft >= maxScroll - 1;

        leftBtn.style.opacity = atLeft ? '0.3' : '1';
        rightBtn.style.opacity = atRight ? '0.3' : '1';
    };

    leftBtn.addEventListener('click', () => {
        gameCards.scrollBy({ left: -300, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        gameCards.scrollBy({ left: 300, behavior: 'smooth' });
    });

    gameCards.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();

    gameCards.addEventListener('wheel', (e) => {
        e.preventDefault();
        gameCards.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    });
});