export class StateController<T = string> {
    private list: {
        name: T,
        to: T[],
    }[] = []; // Add square brackets to indicate an array of objects
    constructor() {
        this.list = [];
    }
    public addState(name: T, to: T[]) {
        // if the state already exists, we update it
        const state = this.list.find((state) => state.name === name);
        if (state) {
            state.to = to;
            return;
        }
        this.list.push({ name, to });
    }
    public removeState(name: T) {
        this.list = this.list.filter((state) => state.name !== name);
    }
    public getState(name: T) {
        return this.list.find((state) => state.name === name);
    }
    public translateState(currentState: T, nextState: T) {
        const state = this.getState(currentState);
        if (!state) {
            return false;
        }
        return state.to.includes(nextState);
    }
}