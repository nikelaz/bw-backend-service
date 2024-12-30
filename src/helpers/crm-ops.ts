import * as hubspot from '@hubspot/api-client';
import { User } from '../models/user';
import { FastifyReply } from 'fastify/types/reply';

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});

const appUsersListId = process.env.HUBSPOT_APP_USERS_LIST_ID;

const getDatestamp = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const activityCache = new Map();

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

  static async updateActivityDate(userEmail: string) {
    const lastActivityDate = activityCache.get(userEmail);
    const today = new Date();
    const datestamp = getDatestamp(today);
  
    if (lastActivityDate === datestamp) return;

    const contactSearchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      query: userEmail,
      properties: ['email'],
    });

    if (!contactSearchResponse.results || contactSearchResponse.results.length === 0) return;

    const contactId = contactSearchResponse.results[0].id;

    if (!contactId) return;

    await hubspotClient.crm.contacts.basicApi.update(contactId, {
      properties: {
        last_web_app_activity: Date.now().toString(),
      },
    });

    activityCache.set(userEmail, datestamp);
  }
}

export default CRMOperations;
