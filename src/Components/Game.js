export class Game {
    clicks = 0;
    cps = 1;
    isRunning = false;

    update = () => {

        // if (this.isRunning) {
            console.log('Game -> update', this.isRunning);
        // }
    }

    start = () => {
        this.isRunning = true;
        console.log('start', this);
    }

    stop = () => {
        this.isRunning = false;
    }

    click = () => {
        console.log('game->click');
        this.clicks++;
    }
}