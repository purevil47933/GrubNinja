import parser from 'fast-xml-parser';
import sanitize from '../util/sanitize';
import headers from '../constants/headers';
import store from '../store';
import { LOGIN_MINIGAME } from '../constants/endpoints';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REQUEST_NEW_TOKEN,
  ACKNOWLEDGE_TOKEN,
  LOAD_CHARACTERS,
  LOAD_INVENTORY,
  LOAD_MAPS,
  LOAD_CROWNS,
  SET_CSID,
  RESET_JAR
} from '../constants/types';
import {
  MINIGAME_ID,
  UDID,
  PLATFORM,
  TOKEN_REFRESH_RATE
} from '../constants/minigame';
import { MAX_RETRIES } from '../constants/config';

export const login = (username, password) => async (dispatch, getState) => {
  dispatch({ type: RESET_JAR });

  const uri = LOGIN_MINIGAME;

  let { session, account } = getState();

  const form = {
    password: password,
    minigameId: MINIGAME_ID,
    username: username,
    udid: UDID,
    platform: PLATFORM
  };

  try {
    console.log('Attempting Login...');

    const body = await window.request({
      method: 'POST',
      uri,
      jar: session,
      headers,
      form
    });

    let data = parser.parse(body, {
      parseNodeValue: false
    }).LoginMinigameResponse;

    if (data.Status.Msg === 'Success') {
      console.log('Successfully logged in');

      if (!account.initialFetched) {
        // TODO: Request mapsCompleted

        setInterval(() => {
          console.log('Token marked as expired. New CSID requested.');
          dispatch({ type: REQUEST_NEW_TOKEN });
        }, TOKEN_REFRESH_RATE);
      }

      // Dispatch reducer for account data
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { username, password }
      });

      // Dispatch multiple reducers for user data
      dispatch({
        type: SET_CSID,
        payload: data.CSID
      });

      dispatch({
        type: LOAD_CHARACTERS,
        payload: sanitize(data.CharacterData)
      });

      dispatch({
        type: LOAD_INVENTORY,
        payload: sanitize(data.Inventory.Item)
      });

      dispatch({
        type: LOAD_MAPS,
        payload: sanitize(data.Inventory.Item)
          .filter(item => item.ItemType === 'MAP_PACK')
          .map(mapPack => mapPack.Sku)
      });

      dispatch({
        type: LOAD_CROWNS,
        payload: data.Inventory.Crowns
      });

      dispatch({ type: ACKNOWLEDGE_TOKEN });

      return Promise.resolve(data);
    } else {
      dispatch({
        type: LOGIN_FAIL
      });
      return Promise.reject(data.Status.Msg + ' - ' + data.Status.Content);
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
    console.log(error);
    return Promise.resolve(store.dispatch(login(username, password)));
  }
};
