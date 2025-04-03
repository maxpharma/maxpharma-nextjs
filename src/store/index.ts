import { createStore } from 'redux';
import reducer from './reducer';
import * as Actions from './actions';
import Select from './selectors';

const store = createStore(reducer);
async function checkReducerUpdate() {
    const reducerModule = await import('./reducer');
    const updatedReducer = reducerModule.default;
    if (reducer !== updatedReducer) {
        store.replaceReducer(updatedReducer);
    }
}
store.subscribe(() => {
    checkReducerUpdate().catch(console.error);
});
export { store, Actions, Select };
