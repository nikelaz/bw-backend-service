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

    let contactCreateResponse;

    try {
      contactCreateResponse = await hubspotClient.crm.contacts.basicApi.create({ properties });
    } catch (error) {
      console.log('hubspot api error: could not create CRM contact');
    }

    if (!contactCreateResponse) {
      return null;
    }

    return contactCreateResponse.id;
  }

  static async addCRMContactToUsersList(crmContactId: string) {
    try {
      await hubspotClient.crm.lists.membershipsApi.add(appUsersListId, [crmContactId]);
    } catch (error) {
      console.log('hubspot api error: could not add CRM contact to users list');
    }
  }

  static async updateActivityDate(userEmail: string) {
    const lastActivityDate = activityCache.get(userEmail);
    const today = new Date();
    const datestamp = getDatestamp(today);
  
    if (lastActivityDate === datestamp) return;

    let contactSearchResponse;

    try {
      contactSearchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
        query: userEmail,
        properties: ['email'],
      });
    } catch (error) {
      console.log('hubspot api error: could not find user to update activity date');
    }

    if (!contactSearchResponse || !contactSearchResponse.results || contactSearchResponse.results.length === 0) return;

    const contactId = contactSearchResponse.results[0].id;

    if (!contactId) return;

    try {
      await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties: {
          last_web_app_activity: Date.now().toString(),
        },
      });
    } catch (error) {
      console.log('hubspot api error: could not update last web app activity of found user');
    }

    activityCache.set(userEmail, datestamp);
  }
}

export default CRMOperations;
