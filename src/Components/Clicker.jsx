import * as React from 'react';

import './Clicker.css';

export class Clicker extends React.Component {

    state = {
        now: 0,
        last: 0,
        dt: 0,
        dtAcc: 0,

        ticks: 0,
        isRunning: false,
        gameOver: false,
        playerWon: false,
        waresCount: 2,

        wares: [
            { name: 'A', count: 0, isLoading: false, btnClass: 'btn-success' },
            { name: 'B', count: 0, isLoading: false, btnClass: 'btn-info' },
            { name: 'C', count: 0, isLoading: false, btnClass: 'btn-warning' },
        ],

        orders: [
            // 2 wares every 3 sec
            { id: 1, current: true, atTicks: 3, waresCount: 2, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 1 }, { name: 'C', count: 0 }] },
            { id: 2, current: false, atTicks: 6, waresCount: 2, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 0 }, { name: 'C', count: 1 }] },

            // 3 wares every 3 sec
            { id: 3, current: false, atTicks: 10, waresCount: 3, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 1 }, { name: 'C', count: 1 }] },
            { id: 4, current: false, atTicks: 13, waresCount: 3, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 2 }, { name: 'C', count: 0 }] },
            { id: 5, current: false, atTicks: 16, waresCount: 3, wares: [{ name: 'A', count: 2 }, { name: 'B', count: 1 }, { name: 'C', count: 0 }] },

            // 5 wares every 3 sec
            { id: 6, current: false, atTicks: 20, waresCount: 5, wares: [{ name: 'A', count: 2 }, { name: 'B', count: 2 }, { name: 'C', count: 1 }] },
            { id: 7, current: false, atTicks: 23, waresCount: 5, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 2 }, { name: 'C', count: 2 }] },
            { id: 8, current: false, atTicks: 26, waresCount: 5, wares: [{ name: 'A', count: 2 }, { name: 'B', count: 1 }, { name: 'C', count: 2 }] },

            // 7 wares every 3 sec
            { id: 9, current: false, atTicks: 30, waresCount: 7, wares: [{ name: 'A', count: 2 }, { name: 'B', count: 3 }, { name: 'C', count: 2 }] },
            { id: 10, current: false, atTicks: 33, waresCount: 7, wares: [{ name: 'A', count: 1 }, { name: 'B', count: 3 }, { name: 'C', count: 3 }] },
            { id: 11, current: false, atTicks: 36, waresCount: 7, wares: [{ name: 'A', count: 3 }, { name: 'B', count: 2 }, { name: 'C', count: 3 }] },
        ]
    };

    render() {

        const displayOrders = [];
        const currentOrder = this.state.orders.find(p => p.current === true);
        if (currentOrder !== undefined) {
            displayOrders.push(currentOrder);

            const nextOrder = this.state.orders.find(p => p.id === currentOrder.id + 1);
            if (nextOrder !== undefined) {
                displayOrders.push(nextOrder);
            }
        }

        return (
            <div className="text-center">
                {/* <div className="text-alert">
                    <ul>
                        <li>now: {this.state.now}</li>
                        <li>last: {this.state.last}</li>
                        <li>dt: {this.state.dt}</li>
                        <li>dtAcc: {this.state.dtAcc}</li>
                        <li>isRunning: {this.state.isRunning.toString()}</li>
                    </ul>
                </div> */}
                {this.state.gameOver
                    ? <h1>GAME OVER!</h1>
                    : ''}

                {this.state.gameOver && this.state.playerWon
                    ? <h1 className="text-info">YOU WON!</h1>
                    : ''}

                {this.state.gameOver && !this.state.playerWon
                    ? <h1 className="text-danger">YOU LOST</h1>
                    : ''}



                {this.state.isRunning
                    ? <button className="btn btn-lg btn-danger mb-3" onClick={() => this.stop()}>Stop Game</button>
                    : <button className="btn btn-lg btn-secondary mb-3" onClick={() => this.start()}>Start Game</button>}

                <h1>Clock: {this.state.ticks}</h1>

                <h4>{this.state.waresCount} Wares in your store</h4>
                <div><small>Click to order new ones</small></div>
                {this.state.wares.map((ware, idx) =>
                    <button key={idx} className={'btn mr-3 ' + (ware.btnClass) + (ware.isLoading ? ' disabled' : '')} onClick={() => this.click(ware)}>{ware.count}</button>
                )}

                <hr />
                <h4>Orders</h4>
                <div><small>Incoming orders, be sure to fill them out in time!</small></div>
                {displayOrders.length
                    ? displayOrders.map((order, idx) =>
                        <div key={idx} className={'order' + (order.current ? ' current' : '')}>
                            <div>
                                <span className="mr-3">Going out @ {order.atTicks} 'o Clock: </span><br />
                                {order.wares.map((ware, idx2) => <span key={idx2} className={'badge ' + (this.orderWareColor(ware.name))}>{ware.count}</span>)}
                            </div>
                        </div>
                    )
                    : 'no more orders!'}
            </div>
        );
    }

    loop = () => {
        const { game } = this.state;

        const now = window.performance.now();
        const dt = now - this.state.last;
        let dtAcc = this.state.dtAcc + dt;

        // tick! do stuff here
        if (dtAcc >= 1000) {
            dtAcc = 0;
            // console.log('tick', window.performance.now());

            // Not enough wares ? GAME OVER
            if (this.state.wares.find(p => p.count < 0) !== undefined) {
                this.setState({ isRunning: false, gameOver: true });
            }

            // update
            this.update();
        }

        const last = now;
        this.setState({
            now,
            last,
            dt,
            dtAcc,
            game
        });

        if (this.state.isRunning) {
            requestAnimationFrame(this.loop);
        }
    }

    start = () => {
        this.setState({ isRunning: true }, () => requestAnimationFrame(this.loop));
    }

    stop = () => {
        this.setState({ isRunning: false });
    }

    click = (bay) => {
        if (this.state.waresCount > 0) {
            this.setState(prevState => ({ waresCount: prevState.waresCount - 1 }));
            console.log('bay: ', bay);
            if (this.state.isRunning && !bay.isLoading) {
                bay.isLoading = true;

                setTimeout(() => {
                    bay.count++;
                    bay.isLoading = false;
                }, 250);
            }
        }
    }

    update = () => {
        this.setState(prevState => ({ ticks: prevState.ticks + 1 }), () => {

            // Randomm event
            // const rnd = Math.floor(Math.random() * (100 - 0));
            // if (rnd < 10) {
            //     console.log('a new order is going out!');
            // }

            const wares = [...this.state.wares];
            const orders = [...this.state.orders];

            const currentOrder = orders.find(p => p.current === true && p.atTicks === this.state.ticks);
            console.log('currentOrder', currentOrder);

            // Order going out
            if (currentOrder !== undefined) {
                console.log('order going out!');


                // Subtract wares
                currentOrder.wares.forEach(wareOrder => {
                    wares.forEach(ware => {
                        if (ware.name === wareOrder.name) {
                            ware.count -= wareOrder.count;
                        }
                    });
                });

                // warezcount
                let waresCount = currentOrder.waresCount;

                // Set current on next order
                currentOrder.current = false;
                const nextOrder = orders.find(p => p.id === currentOrder.id + 1);

                // No next orders found, STOP THE GAME
                if (nextOrder === undefined) {
                    this.setState({ isRunning: false, gameOver: true, playerWon: true });
                } else {
                    nextOrder.current = true;
                    waresCount = nextOrder.waresCount;
                }


                this.setState({
                    waresCount,
                    wares,
                    orders
                });
            }
        });
    }

    orderWareColor = (name) => {
        if (name === 'A') {
            return 'badge-success';
        }
        if (name === 'B') {
            return 'badge-info';
        }
        if (name === 'C') {
            return 'badge-warning';
        }
    }

}

