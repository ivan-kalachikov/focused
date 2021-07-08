import { createStore } from 'vuex';
import airports from './data/airports.json';
import music from './data/music.json';
import {
  AIRPORT_URL_BASE,
  DEFAULT_AIRPORT_CODE,
  DEFAULT_MUSIC_ID,
  DEFAULT_MUSIC_VOLUME,
  DEFAULT_AIRPORT_VOLUME,
} from './constants';

const getAirportUrlByCode = (code) => {
  const { urlPostfix } = airports.find(({ codeIATA }) => codeIATA === code);
  return new URL(urlPostfix, AIRPORT_URL_BASE).toString();
};

const store = createStore({
  state() {
    return {
      appStatus: 'paused',
      music: {
        currentId: DEFAULT_MUSIC_ID,
        currentUrl: music[DEFAULT_MUSIC_ID].url,
        list: music,
        status: 'idle',
        error: null,
        volume: DEFAULT_MUSIC_VOLUME,
      },
      airports: {
        currentCode: DEFAULT_AIRPORT_CODE,
        currentUrl: getAirportUrlByCode(DEFAULT_AIRPORT_CODE),
        list: airports,
        status: 'idle',
        error: null,
        volume: DEFAULT_AIRPORT_VOLUME,
      },
    };
  },
  mutations: {
    setAppStatus(state, status) {
      state.appStatus = status;
    },
    setCurrentAirportCode(state, code) {
      state.airports.currentCode = code;
      state.airports.currentUrl = getAirportUrlByCode(code);
    },
    setAirportStatus(state, status) {
      state.airports.status = status;
    },
    setAirportError(state, message) {
      state.airports.error = message;
    },
    setAirportVolume(state, volume) {
      state.airports.volume = volume;
    },
    setCurrentMusicId(state, id) {
      state.music.currentId = id;
      state.music.currentUrl = state.music.list[state.music.currentId].url;
    },
    setMusicStatus(state, status) {
      state.music.status = status;
    },
    setMusicError(state, message) {
      state.music.error = message;
    },
    setMusicVolume(state, volume) {
      state.music.volume = volume;
    },
  },
});

export default store;
