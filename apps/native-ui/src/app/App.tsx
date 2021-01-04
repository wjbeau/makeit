import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { store } from './store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FinanceView } from './finance/FinanceView';
import { ProjectsView } from './projects/ProjectsView';
import { AuditionsHome } from './auditions/AuditionsHome';

const Tab = createBottomTabNavigator();

// const checkLoggedIn = () => {
//     let auth = useSelector(selectAuthed);
//     const dispatch = useAppDispatch();
//     const [refresh, setRefresh] = useState<boolean>(false);

//     //if the user previously asked to be remembered, try a reauth here
//     if (!auth && !refresh) {
//       const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
//       const user = localStorage.getItem(REFRESH_USER_KEY);
//       console.log('Refresh is here: ' + refresh)
//       console.log('User is here: ' + user)
//       if (refresh && user) {
//         setRefresh(true);
//         dispatch(
//           refreshToken({ username: user, token: JSON.parse(refresh).token })
//         )
//           .then(unwrapResult)
//           .then((d) => {
//             auth = d.user;
//             setRefresh(false);
//           });
//       }
//     }
//   }

export const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Auditions" component={AuditionsHome} />
          <Tab.Screen name="Projects" component={ProjectsView} />
          <Tab.Screen name="Finance" component={FinanceView} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
  },
});

export default App;
