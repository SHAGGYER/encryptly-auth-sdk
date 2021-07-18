const axios = require("axios");

exports.checkToken = async ({ serverUrl, token, clientId, clientSecret }) => {
  let returnObj = {
    user: null,
    error: null,
  };

  try {
    const response = await axios.get(
      serverUrl +
        "/api/auth/account?token=" +
        token +
        `&client_id=${clientId}&client_secret=${clientSecret}`
    );
    if (response.data.authorized) {
      returnObj.user = response.data.user;
    }
  } catch (error) {
    returnObj.error = error.response.data.error;
  }

  return returnObj;
};


