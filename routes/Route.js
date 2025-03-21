// import React from "react";
// import {
//   NavigationContainer,
//   useNavigationContainerRef,
// } from "@react-navigation/native";
// import AppStack from "./AppStack";
// import { AuthStack } from "./AuthStack";
// import { useAuth } from "../screens/ThemeContext";

// export function Router() {
//   const { authUser, isLoggedIn } = useAuth();

//   /*const nav = (
//     <NavigationContainer>
//       {isLoggedIn ? (authUser.sso==1 ? <AppStackSSO /> : <AppStack />) : <AuthStack />}
//     </NavigationContainer>
//   );*/

//   const nav = (
//     <NavigationContainer>
//       {isLoggedIn ? (
//         authUser.validated == 1 ? (
//           <AppStack />
//         ) : (
//           <AuthStack />
//         )
//       ) : (
//         <AuthStack />
//       )}
//     </NavigationContainer>
//   );

//   return nav;
// }


import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import AppStack from "./AppStack";
import { AuthStack } from "./AuthStack";
import { ChgPwdStack } from "./ChgPwdStack";
import { useAuth } from "../screens/ThemeContext";

export function Router() {
  const { authUser, isLoggedIn, chgPwd, setChgPwd } = useAuth();

  /*const nav = (
    <NavigationContainer>
      {isLoggedIn ? (authUser.sso==1 ? <AppStackSSO /> : <AppStack />) : <AuthStack />}
    </NavigationContainer>
  );*/
  //console.log('authUser',authUser);
  const nav = (
    <NavigationContainer>
      {isLoggedIn ? (
        authUser.validated === 1 ? (
          authUser?.chgpwd === "1" ? (
            <AuthStack />
          ) : (
            <AppStack />
          )
        ) : (
          <AuthStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );

  return nav;
}
