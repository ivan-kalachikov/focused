import { createStore } from 'vuex';
import airports from './data/airports.json';
import music from './data/music.json';
import { AIRPORT_URL_BASE, DEFAULT_AIRPORT_CODE, DEFAULT_MUSIC_ID } from './constants';

const getAirportUrlByCode = (code) => {
  const { urlPostfix } = airports.find(({ codeIATA }) => codeIATA === code);
  return new URL(urlPostfix, AIRPORT_URL_BASE).toString();
};

const store = createStore({
  state() {
    return {
      appStatus: 'playing',
      currentAirportCode: DEFAULT_AIRPORT_CODE,
      currentAirportUrl: getAirportUrlByCode(DEFAULT_AIRPORT_CODE),
      currentMusicId: DEFAULT_MUSIC_ID,
      currentMusicUrl: music[DEFAULT_MUSIC_ID].url,
      airports,
      music,
    };
  },
  mutations: {
    setAppStatus(state, status) {
      state.appStatus = status;
    },
    setCurrentAirportCode(state, code) {
      state.currentAirportCode = code;
      state.currentAirportUrl = getAirportUrlByCode(code);
    },
    setCurrentMusicId(state, id) {
      state.currentMusicId = id;
      state.currentMusicUrl = state.music[state.currentMusicId].url;
    },
  },
});

export default store;
