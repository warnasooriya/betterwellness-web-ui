// import {Auth } from 'aws-amplify';

const useRefreshToken = () => {


    const refresh = async () => {
        try {
        //   const currentUser = await Auth.currentAuthenticatedUser();
        //   const refreshToken = currentUser.signInUserSession.refreshToken.token;
      
        //   const session = await Auth.refreshSession(refreshToken);
        //   const newAccessToken = session.getAccessToken().getJwtToken();
        const newAccessToken = "newAccessToken";
          // Update access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);
      
          console.log("Access token refreshed:", newAccessToken);
            return newAccessToken
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      };
    return refresh
};

export default useRefreshToken
