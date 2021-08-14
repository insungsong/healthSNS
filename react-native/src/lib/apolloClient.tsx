// import { firebase } from "@react-native-firebase/auth";
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import jwtDecode from 'jwt-decode';
import {BACKEND_ENDPOINT} from '../config/apollo';
import AsyncStorage from '@react-native-community/async-storage';
import gql from 'graphql-tag';

// const getToken = async () => {
//   return await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
// };

const getToken = async ({access_token, refresh_token}) => {
  if (access_token) {
    try {
      const {exp} = jwtDecode(access_token);

      if (Date.now() < (exp - 600) * 1000) {
        return access_token;
      }
    } catch (e) {}
  }

  if (refresh_token) {
    const res = await fetch(BACKEND_ENDPOINT + '/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        operationName: null,
        query: gql`
          mutation($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              access_token
            }
          }
        `.loc.source.body,
        variables: {
          refreshToken: refresh_token,
        },
      }),
    });

    const {data} = await res.json();
    const access_token = data.refreshToken.access_token;
    await AsyncStorage.setItem('access_token', access_token);
    return access_token;
  }
};

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: BACKEND_ENDPOINT + '/graphql',
});

const authLink: any = setContext(async (_, {headers}) => {
  const refresh_token = await AsyncStorage.getItem('refresh_token');
  const access_token = await AsyncStorage.getItem('access_token');
  console.log('📜', access_token);
  let token: String;

  try {
    token = await getToken({access_token, refresh_token});
  } catch (e) {}

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
});

export default apolloClient;
