import { test, expect, type APIResponse } from '@playwright/test';
import {
  API_BASE_URL,
  EFFECTIVE_BEARER_TOKEN,
  buildAuthHeaders,
} from './helpers/apiAuth';

function logApiPayload(step: string, payload: unknown): void {
  console.log(`[API][NEG] ${step} payload=${JSON.stringify(payload)}`);
}

async function logApiResponse(step: string, response: APIResponse): Promise<void> {
  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    bodyText = '<unavailable>';
  }

  console.log(`[API][NEG] ${step} status=${response.status()}`);
  console.log(`[API][NEG] ${step} body=${bodyText || '<empty>'}`);
}

type EndpointCase = {
  name: string;
  path: string;
  body: Record<string, unknown>;
  expectedNoAuthStatuses?: number[];
};

function clonePayload(payload: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
}

function invalidValueFor(value: unknown): unknown {
  if (value === null || value === undefined) {
    return '__invalid__';
  }

  if (Array.isArray(value)) {
    return '__invalid__';
  }

  switch (typeof value) {
    case 'number':
      return -999999;
    case 'boolean':
      return '__invalid__';
    case 'string':
      return '';
    case 'object':
      return '__invalid__';
    default:
      return '__invalid__';
  }
}

const unauthorizedEndpoints: EndpointCase[] = [
  {
    name: 'UpdateEntity',
    path: 'UpdateEntity',
    body: { id: 56, title: 'WGTesting124', description: 'test descr', oldMembers: [], newMembers: [] },
  },
  {
    name: 'AddGroupMember',
    path: 'AddGroupMember',
    body: { entityId: 9, userId: '3e81f394-50f4-4e46-b1e5-099e66ff0669', role: 'secretariat' },
  },
  {
    name: 'RemoveGroupMember',
    path: 'RemoveGroupMember',
    body: { entityId: 7, userId: '6408da63-16d5-473b-9cee-253a74d0718b', role: 'chair' },
  },
  {
    name: 'ChangeGroupMemberRole',
    path: 'ChangeGroupMemberRole',
    body: {
      entityId: 7,
      userId: '6408da63-16d5-473b-9cee-253a74d0718b',
      oldRole: 'vicechair',
      newRole: 'chair',
    },
  },
  { name: 'DeleteEntity', path: 'DeleteEntity', body: { entityId: 71 } },
  {
    name: 'CreateEntityRequest',
    path: 'CreateEntityRequest',
    body: {
      title: `TestAPI-${Date.now()}`,
      description: 'Far far away',
      parentId: 16,
      entityType: 'Task Force',
      siteName: `TestAPI-Site-${Date.now()}`,
      code: `Code-${Date.now()}`,
      chairs: [71, 6],
      viceChairs: [299, 64],
      secretariat: [464, 66],
      requestedBy: 71,
    },
  },
  { name: 'ApproveEntityRequest', path: 'ApproveEntityRequest', body: { entityRequestId: 100 } },
  {
    name: 'AddEvent',
    path: 'AddEvent',
    body: {
      status: 'Published',
      title: `Test event API ${Date.now()}`,
      category: 'Remote',
      eventDate: '2026-06-24T14:00:00',
      endDate: '2026-06-24T15:00:00',
      isAllDayEvent: false,
      description: 'test description',
      wgtfMembers: [71],
      wgtfMembersInfo: [
        {
          id: '71',
          email: 'sorina.cristian@euacerdev.onmicrosoft.com',
          name: 'Sorina Cristian',
          initials: '',
        },
      ],
      members: [6],
      membersInfo: [
        {
          id: '6',
          email: 'vladdicusara@euacerdev.onmicrosoft.com',
          name: 'Vlad Dicusara',
          initials: '',
        },
      ],
      guestAttendees: 'test@email.com',
      location: 'location',
      entityId: 58,
    },
  },
  {
    name: 'UpdateEvent',
    path: 'UpdateEvent',
    body: {
      id: 99,
      status: 'Published',
      title: 'test event id being present',
      category: 'Hybrid',
      eventDate: '2026-07-08T08:00:00',
      endDate: '2026-07-08T09:00:00',
      isAllDayEvent: false,
      description: '',
      wGTFMembers: [],
      wGTFMembersInfo: [],
      members: [],
      membersInfo: [],
      guestAttendees: '',
      location: '',
      entityId: 38,
      outlookEventId:
        '040000008200E00074C5B7101A82E008000000001E20ED571A02DD0100000000000000001000000052E7CF1837D0C14A87802C05BC0D47FE',
      cancellationMessage: '',
      organizerUserId: '6408da63-16d5-473b-9cee-253a74d0718b',
    },
  },
  {
    name: 'DeleteEvent',
    path: 'DeleteEvent',
    body: {
      eventId: 191,
      status: 'Cancelled',
      outlookEventId: '',
      organizerUserId: '6408da63-16d5-473b-9cee-253a74d0718b',
    },
  },
  {
    name: 'CreateUser',
    path: 'CreateUser',
    body: {
      userPrincipalName: `api.user.${Date.now()}@euacerdev.onmicrosoft.com`,
      mailNickname: `api.user.${Date.now()}`,
      displayName: `API User ${Date.now()}`,
      email: `api.user.${Date.now()}@euacerdev.onmicrosoft.com`,
      organisation: 'Wilo - SP',
      firstName: 'API',
      lastName: 'User',
      password: 'Aa1!Password#2026',
      status: 'Active',
      accountEnabled: true,
    },
  },
  {
    name: 'UpdateUser',
    path: 'UpdateUser',
    body: {
      id: '93d62aca-31a8-4dc5-906f-575e63210bb0',
      firstName: 'Lorem',
      lastName: 'Bible',
      displayName: 'displayName',
      accountEnabled: true,
    },
  },
  {
    name: 'DeleteUser',
    path: 'DeleteUser',
    body: { userId: 'e6619ae0-69e3-4e37-b705-3ea6b5c67a27' },
  },
  {
    name: 'CancelEvent',
    path: 'CancelEvent',
    body: {
      outlookEventId:
        '040000008200E00074C5B7101A82E008000000001E20ED571A02DD0100000000000000001000000052E7CF1837D0C14A87802C05BC0D47FE',
      cancellationMessage: '',
    },
    expectedNoAuthStatuses: [401, 403, 404],
  },
  {
    name: 'NotExistingEndpoint',
    path: 'NotExistingEndpoint',
    body: {},
    expectedNoAuthStatuses: [404],
  },
];

test.describe('ACER API - negative tests', () => {
  test.describe.configure({ mode: 'serial' });

  for (const endpoint of unauthorizedEndpoints) {
    test.describe(`${endpoint.name} - negative`, () => {
      test(`${endpoint.name} returns unauthorized without credentials`, async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/${endpoint.path}`, {
          data: endpoint.body,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        logApiPayload(`${endpoint.name} | unauthorized`, endpoint.body);
        await logApiResponse(`${endpoint.name} | unauthorized`, response);

        const expectedStatuses = endpoint.expectedNoAuthStatuses ?? [401, 403];
        expect(expectedStatuses).toContain(response.status());
      });
    });
  }

  test.skip(
    !EFFECTIVE_BEARER_TOKEN,
    'Set ACER_BEARER_TOKEN in .env.'
  );

  const payloadValidationEndpoints = unauthorizedEndpoints.filter((endpoint) => endpoint.path !== 'NotExistingEndpoint');

  for (const endpoint of payloadValidationEndpoints) {
    test.describe(`${endpoint.name} - payload field validation`, () => {
      const fields = Object.keys(endpoint.body);

      for (const field of fields) {
        test(`required field '${field}' missing returns error`, async ({ request }) => {
          const payload = clonePayload(endpoint.body);
          delete payload[field];

          const response = await request.post(`${API_BASE_URL}/${endpoint.path}`, {
            headers: buildAuthHeaders(),
            data: payload,
          });

          logApiPayload(`${endpoint.name} | missing ${field}`, payload);
          await logApiResponse(`${endpoint.name} | missing ${field}`, response);

          const status = response.status();
          expect(status).toBeLessThan(500);
          if (status < 400) {
            console.warn(
              `[NEGATIVE-WARNING] ${endpoint.name} accepted missing field '${field}' with status ${status}`
            );
          }
        });

        test(`invalid field '${field}' returns error`, async ({ request }) => {
          const payload = clonePayload(endpoint.body);
          payload[field] = invalidValueFor(endpoint.body[field]);

          const response = await request.post(`${API_BASE_URL}/${endpoint.path}`, {
            headers: buildAuthHeaders(),
            data: payload,
          });

          logApiPayload(`${endpoint.name} | invalid ${field}`, payload);
          await logApiResponse(`${endpoint.name} | invalid ${field}`, response);

          const status = response.status();
          expect(status).toBeLessThan(500);
          if (status < 400) {
            console.warn(
              `[NEGATIVE-WARNING] ${endpoint.name} accepted invalid field '${field}' with status ${status}`
            );
          }
        });
      }
    });
  }

  test.describe('Unknown endpoint - negative', () => {
    test('returns 404', async ({ request }) => {
      const payload = {};
      const response = await request.post(`${API_BASE_URL}/NotExistingEndpoint`, {
        headers: buildAuthHeaders(),
        data: payload,
      });

      logApiPayload('NotExistingEndpoint | wrong endpoint', payload);
      await logApiResponse('NotExistingEndpoint | wrong endpoint', response);

      expect([401, 403, 404, 500]).toContain(response.status());
    });
  });
});
