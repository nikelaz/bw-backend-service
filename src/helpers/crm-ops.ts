import * as hubspot from '@hubspot/api-client';
import { User } from '../models/user';

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});

const appUsersListId = process.env.HUBSPOT_APP_USERS_LIST_ID;

class CRMOperations {
  /**
   * Creates a new contact in HubSpot from a provided app user
   * @param user 
   * @returns hubspotContactIds
   */
  static async createCRMContact(user: User) {
    const properties = {
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      lifecyclestage: 'subscriber',
      last_web_app_activity: Date.now().toString(),
    };

    const contactCreateResponse = await hubspotClient.crm.contacts.basicApi.create({ properties });

    return contactCreateResponse.id;
  }

  static async addCRMContactToUsersList(crmContactId: string) {
    await hubspotClient.crm.lists.membershipsApi.add(appUsersListId, [crmContactId]);
  }
}

export default CRMOperations;
