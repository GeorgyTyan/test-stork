let store = {
  set state(value){
    this._state = value
  },
  get state() {
    return this._state;
  }
};

export default store;