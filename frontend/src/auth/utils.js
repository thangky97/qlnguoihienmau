const express = require("express");

const app = express();
const port = 3000;
const axios = require("axios");
const querystring = require("querystring");

const appId = "1744234245328393497";
const secretKey = "470Y1W5HD7H3AB54xVsq";

const code =
  "1irMO_jA3GPrcZikpZPoFJg_IrJq3du4ROS2NRLgUnr_tJ58pWizTKcLT5xF8tqn0919PxGsE3Lzu7PsiLW_8GwF3WknEteH1TjJHiToRXLEsY1zc1j02X2wBt7LD5C5DCn9CBLYH4zhg2b9kq0XU339P2-49ciiOETD8V9JUMXcYsG6e5DPLaRY32Z_Sm8pPwKSDwGjRWKSYY8ncnKfJaNPRN-n4pq19Pie4_XTDXORqnahrIyGNWpA0Z38VGvx4Vfq1RfwR1CrahT7lNAH8Z3Mgl6CPQwOJDIQoSPYfeO-j_ZamZQ7eacNZR_C8_6co4jVd1xAK_bZUptccvf3aKTAUA3ixbhlH2v_hDRxQBe8CqsFuFLcybqmIg3qxsZWYuATOFeYA1G"; // Replace with the authorization code obtained from the user
const grantType = "authorization_code";

async function getZaloAccessToken() {
  try {
    const apiUrl = "https://oauth.zaloapp.com/v4/oa/access_token";

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secretKey,
    };

    const data = {
      app_id: appId,
      code: code,
      grant_type: grantType,
    };

    const response = await axios.post(apiUrl, querystring.stringify(data), {
      headers: headers,
    });

    const accessToken = response.data.access_token;

    // Use the access token for your Zalo OA API requests
    console.log("Zalo OA Access Token:", response);

    return accessToken;
  } catch (error) {
    console.error(
      "Error getting Zalo OA Access Token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Example usage:

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  getZaloAccessToken()
    .then((accessToken) => {
      // Use the access token for API requests
    })
    .catch((error) => {
      // Handle the error
    });
});
