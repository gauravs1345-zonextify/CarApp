import axios from "axios";
import Listing from "./model/Listing.js";

const ZOHO_ACCESS_TOKEN = "your_access_token_here";

const syncToZoho = async () => {
  const listings = await Listing.find().lean();

  for (const item of listings) {
    const payload = {
      data: [{
        Car_Title__c: item["Listing title"],
        Make__c: item.Make,
        Model_Year__c: item["Model year"],
        Price__c: item["Main price"],
        Currency__c: item.Currency,
        Contact_Number__c: item.Phone,
        Country__c: item.Country,
        Source__c: item["Source name"],
        Main_Image_URL__c: item.mainImage
      }]
    };

    try {
      const response = await axios.post(
        "https://www.zohoapis.com/crm/v2/CustomModule1", // Replace with your module
        payload,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`
          }
        }
      );
      console.log("Synced:", response.data);
    } catch (err) {
      console.error("Zoho Sync Error:", err.response?.data || err.message);
    }
  }
};

syncToZoho();
