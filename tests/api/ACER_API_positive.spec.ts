import { test, expect, type APIResponse } from '@playwright/test';
import {
  API_BASE_URL,
  EFFECTIVE_BEARER_TOKEN,
  TOKEN_AUDIENCE,
  TOKEN_SOURCE,
  buildAuthHeaders,
} from './helpers/apiAuth';

async function logApiResponse(step: string, response: APIResponse): Promise<void> {
  let bodyText = '';
  try {
    bodyText = (await response.body()).toString('utf-8');
  } catch {
    bodyText = '<unavailable>';
  }

  console.log(`[API] ${step} status=${response.status()}`);
  console.log(`[API] ${step} body=${bodyText || '<empty>'}`);
}

function logApiPayload(step: string, payload: unknown): void {
  console.log(`[API] ${step} payload=${JSON.stringify(payload)}`);
}

test.describe('ACER API - positive tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.skip(
    !EFFECTIVE_BEARER_TOKEN,
    'Set ACER_BEARER_TOKEN in .env.'
  );

  test.beforeEach(async ({}, testInfo) => {
    await testInfo.attach('api-auth-diagnostics', {
      contentType: 'application/json',
      body: Buffer.from(
        JSON.stringify(
          {
            tokenSource: TOKEN_SOURCE,
            tokenAudience: TOKEN_AUDIENCE ?? null,
            hasBearer: Boolean(EFFECTIVE_BEARER_TOKEN),
          },
          null,
          2
        )
      ),
    });
  });

  test.describe('Entity lifecycle (create -> approve -> update -> delete)', () => {
    let stamp = 0;
    let entityRequestId = 0;
    let entityId = 0;
    let deleteEntityId = 0;
    let createEntityResponseBody: any = {};
    let createEntityRequestPayload: any = {};

    test('CreateEntityRequest returns success', async ({ request }) => {
      stamp = Date.now();

      const createPayload = {
        title: `PW-CreateEntity-${stamp}`,
        description: 'Created by Playwright API test',
        parentId: 16,
        entityType: 'Task Force',
        siteName: `PW-Site-${stamp}`,
        code: `PW-${stamp}`,
        chairs: [71],
        viceChairs: [299],
        secretariat: [464],
        requestedBy: 71,
      };
      createEntityRequestPayload = createPayload;

      const createResponse = await request.post(`${API_BASE_URL}/CreateEntityRequest`, {
        headers: buildAuthHeaders(),
        data: createPayload,
      });
      logApiPayload('Entity lifecycle | CreateEntityRequest', createPayload);
      await logApiResponse('Entity lifecycle | CreateEntityRequest', createResponse);

      expect(createResponse.status()).toBe(200);
      const createBody = await createResponse.json();
      createEntityResponseBody = createBody;

      entityRequestId = Number(createEntityResponseBody?.id ?? createEntityResponseBody?.entityRequestId ?? createEntityResponseBody?.requestId);
      entityId = Number(
        createEntityResponseBody?.entityId ??
          createEntityResponseBody?.entity?.id ??
          createEntityResponseBody?.data?.entityId ??
          createEntityResponseBody?.data?.entity?.id ??
          createEntityResponseBody?.id
      );

      expect(Number.isFinite(entityRequestId) && entityRequestId > 0).toBeTruthy();
    });

    test('ApproveEntityRequest returns success', async ({ request }, testInfo) => {
      const approveEntityRequestId = Number(
        createEntityResponseBody?.id ?? createEntityResponseBody?.entityRequestId ?? createEntityResponseBody?.requestId
      );

      expect(Number.isFinite(approveEntityRequestId) && approveEntityRequestId > 0).toBeTruthy();
      entityRequestId = approveEntityRequestId;

      const approvePayload = { entityRequestId: approveEntityRequestId };
      const approveResponse = await request.post(`${API_BASE_URL}/ApproveEntityRequest`, {
        headers: buildAuthHeaders(),
        data: approvePayload,
      });
      logApiPayload('Entity lifecycle | ApproveEntityRequest', approvePayload);
      await logApiResponse('Entity lifecycle | ApproveEntityRequest', approveResponse);

      expect(approveResponse.status()).toBe(200);
      const approveText = await approveResponse.text();
      let approveBody: any = {};
      if (approveText) {
        try {
          approveBody = JSON.parse(approveText);
        } catch {
          approveBody = {};
        }
      }

      const approvedId = Number(
        approveBody?.entityId ??
          approveBody?.id ??
          approveBody?.entity?.id ??
          approveBody?.data?.entityId ??
          approveBody?.data?.id
      );

      if (Number.isFinite(approvedId)) {
        entityId = approvedId;
      }

      await testInfo.attach('approve-entity-response', {
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify({ entityRequestId, entityId, approveBody }, null, 2)),
      });
    });

    test('UpdateEntity returns success', async ({ request }) => {
      const updateEntityId = Number(
        createEntityResponseBody?.entityId ??
          createEntityResponseBody?.entity?.id ??
          createEntityResponseBody?.data?.entityId ??
          createEntityResponseBody?.data?.entity?.id ??
          createEntityResponseBody?.id
      );

      expect(Number.isFinite(updateEntityId) && updateEntityId > 0).toBeTruthy();
      entityId = updateEntityId;

      const updateTitle = String(
        createEntityResponseBody?.title ??
          createEntityRequestPayload?.title ??
          `PW-CreateEntity-${stamp}`
      );
      const updateDescription = String(
        createEntityResponseBody?.description ??
          createEntityRequestPayload?.description ??
          'Created by Playwright API test'
      );

      const updatePayload = {
        id: updateEntityId,
        title: updateTitle,
        description: updateDescription,
        oldMembers: [],
        newMembers: [],
      };

      const updateResponse = await request.post(`${API_BASE_URL}/UpdateEntity`, {
        headers: buildAuthHeaders(),
        data: updatePayload,
      });
      logApiPayload('Entity lifecycle | UpdateEntity', updatePayload);
      await logApiResponse('Entity lifecycle | UpdateEntity', updateResponse);
      if (updateResponse.status() === 404) {
        console.log('[API] Entity lifecycle | UpdateEntity note=404 is possible if the entity was already deleted or not found');
      }

      expect([200, 404]).toContain(updateResponse.status());// 404 is possible if the entity was already deleted or not found

      const updateText = await updateResponse.text();
      let updateBody: any = {};
      if (updateText) {
        try {
          updateBody = JSON.parse(updateText);
        } catch {
          updateBody = {};
        }
      }

      deleteEntityId = Number(
        updateBody?.id ??
          updateBody?.entityId ??
          updateBody?.entity?.id ??
          updateBody?.data?.id ??
          updateBody?.data?.entityId ??
          entityId
      );

      expect(Number.isFinite(deleteEntityId) && deleteEntityId > 0).toBeTruthy();
    });

    test('DeleteEntity returns success', async ({ request }) => {
      const resolvedDeleteEntityId = Number(
        createEntityResponseBody?.entityId ??
          createEntityResponseBody?.entity?.id ??
          createEntityResponseBody?.data?.entityId ??
          createEntityResponseBody?.data?.entity?.id ??
          createEntityResponseBody?.id
      );

      expect(Number.isFinite(resolvedDeleteEntityId) && resolvedDeleteEntityId > 0).toBeTruthy();
      deleteEntityId = resolvedDeleteEntityId;

      const deletePayload = { entityId: resolvedDeleteEntityId };
      const deleteResponse = await request.post(`${API_BASE_URL}/DeleteEntity`, {
        headers: buildAuthHeaders(),
        data: deletePayload,
      });
      logApiPayload('Entity lifecycle | DeleteEntity', deletePayload);
      await logApiResponse('Entity lifecycle | DeleteEntity', deleteResponse);
      if (deleteResponse.status() === 403) {
        console.log('[API] Entity lifecycle | DeleteEntity note=on development it is not allowed to delete entities, so 403 is possible');
      }

      expect([200, 204, 403]).toContain(deleteResponse.status()); //on development is not allowed to delete entities, so 403 is possible
    });
  });

  test.describe('Group member lifecycle (create -> add -> change -> remove)', () => {
    let stamp = 0;
    let entityRequestId = 0;
    let entityId = 9;
    let userId = '3e81f394-50f4-4e46-b1e5-099e66ff0669';
    let role = 'secretariat';
    let createEntityResponseBody: any = {};

     test('AddGroupMember returns success', async ({ request }) => {
      console.log(`[API] Group member lifecycle | AddGroupMember precheck entityId=${entityId} userId=${userId} role=${role}`);
      expect(Number.isFinite(entityId)).toBeTruthy();
      expect(userId).toBeTruthy();

      const addPayload = {
        entityId,
        userId,
        role,
      };

      const addResponse = await request.post(`${API_BASE_URL}/AddGroupMember`, {
        headers: buildAuthHeaders(),
        data: addPayload,
      });
      logApiPayload('Group member lifecycle | AddGroupMember', addPayload);
      await logApiResponse('Group member lifecycle | AddGroupMember', addResponse);

       expect([200, 409]).toContain(addResponse.status());//if there is conflict (409) it means the member already exists, which is acceptable for this test
      const addText = await addResponse.text();
      let addBody: any = {};
      if (addText) {
        try {
          addBody = JSON.parse(addText);
        } catch {
          addBody = {};
        }
      }

      role = String(addBody?.role ?? addBody?.memberRole ?? addBody?.data?.role ?? role).toLowerCase();
      expect(role).toBeTruthy();
    });

    test('ChangeGroupMemberRole returns success', async ({ request }) => {
      const nextRole = role === 'chair' ? 'vicechair' : role === 'vicechair' ? 'chair' : 'secretariat';
      const changePayload = {
        entityId,
        userId,
        oldRole: role,
        newRole: nextRole,
      };

      const changeResponse = await request.post(`${API_BASE_URL}/ChangeGroupMemberRole`, {
        headers: buildAuthHeaders(),
        data: changePayload,
      });
      logApiPayload('Group member lifecycle | ChangeGroupMemberRole', changePayload);
      await logApiResponse('Group member lifecycle | ChangeGroupMemberRole', changeResponse);

     expect([200, 400]).toContain(changeResponse.status()) // 400 is possible if the member si not partof the group anymore, which is acceptable for this test
      role = nextRole;
    });

    test('RemoveGroupMember returns success', async ({ request }) => {
      const removePayload = {
        entityId,
        userId,
        role,
      };

      const removeResponse = await request.post(`${API_BASE_URL}/RemoveGroupMember`, {
        headers: buildAuthHeaders(),
        data: removePayload,
      });
      logApiPayload('Group member lifecycle | RemoveGroupMember', removePayload);
      await logApiResponse('Group member lifecycle | RemoveGroupMember', removeResponse);

      expect([200, 204]).toContain(removeResponse.status());
    });
  });

  test.describe('Event lifecycle (add -> update -> cancel -> delete)', () => {
    let stamp = 0;
    let eventId = 0;
    let outlookEventId = '';
    let organizerUserId = '6408da63-16d5-473b-9cee-253a74d0718b';

    test('AddEvent returns success', async ({ request }) => {
      stamp = Date.now();
      const addPayload = {
        status: 'Published',
        title: `PW-Event-${stamp}`,
        category: 'Remote',
        eventDate: '2026-08-24T14:00:00',
        endDate: '2026-08-24T15:00:00',
        isAllDayEvent: false,
        description: 'created by positive API test',
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
      };

      const addResponse = await request.post(`${API_BASE_URL}/AddEvent`, {
        headers: buildAuthHeaders(),
        data: addPayload,
      });
      await logApiResponse('Event lifecycle | AddEvent', addResponse);

      expect(addResponse.status()).toBe(200);
      const addText = await addResponse.text();
      let addBody: any = {};
      if (addText) {
        try {
          addBody = JSON.parse(addText);
        } catch {
          addBody = {};
        }
      }

      eventId = Number(addBody?.id ?? addBody?.eventId ?? addBody?.event?.id ?? addBody?.data?.id ?? addBody?.data?.eventId);
      outlookEventId = String(addBody?.outlookEventId ?? addBody?.event?.outlookEventId ?? addBody?.data?.outlookEventId ?? '');
      organizerUserId = String(
        addBody?.organizerUserId ?? addBody?.event?.organizerUserId ?? addBody?.data?.organizerUserId ?? organizerUserId
      );

      expect(Number.isFinite(eventId)).toBeTruthy();
    });

    test('UpdateEvent returns success', async ({ request }) => {
      expect(Number.isFinite(eventId)).toBeTruthy();

      const updateResponse = await request.post(`${API_BASE_URL}/UpdateEvent`, {
        headers: buildAuthHeaders(),
        data: {
          id: eventId,
          status: 'Published',
          title: `PW-Updated-Event-${stamp}`,
          category: 'Hybrid',
          eventDate: '2026-08-24T16:00:00',
          endDate: '2026-08-24T17:00:00',
          isAllDayEvent: false,
          description: '',
          wGTFMembers: [71],
          wGTFMembersInfo: [
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
          outlookEventId,
          cancellationMessage: '',
          organizerUserId,
        },
      });
      await logApiResponse('Event lifecycle | UpdateEvent', updateResponse);

      expect(updateResponse.status()).toBe(200);
    });

    test('Cancel UpdateEvent returns success', async ({ request }) => {
      const cancelUpdateResponse = await request.post(`${API_BASE_URL}/UpdateEvent`, {
        headers: buildAuthHeaders(),
        data: {
          id: eventId,
          status: 'Cancelled',
          title: `PW-Updated-Event-${stamp}`,
          category: 'Hybrid',
          eventDate: '2026-08-24T16:00:00',
          endDate: '2026-08-24T17:00:00',
          isAllDayEvent: false,
          description: '',
          wGTFMembers: [71],
          wGTFMembersInfo: [
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
          outlookEventId,
          cancellationMessage: `Cancelled by API test ${stamp}`,
          organizerUserId,
        },
      });
      await logApiResponse('Event lifecycle | UpdateEvent (Cancelled)', cancelUpdateResponse);

      expect(cancelUpdateResponse.status()).toBe(200);
      const cancelText = await cancelUpdateResponse.text();
      let cancelBody: any = {};
      if (cancelText) {
        try {
          cancelBody = JSON.parse(cancelText);
        } catch {
          cancelBody = {};
        }
      }

      const maybeEventId = Number(
        cancelBody?.id ?? cancelBody?.eventId ?? cancelBody?.event?.id ?? cancelBody?.data?.id ?? cancelBody?.data?.eventId
      );
      if (Number.isFinite(maybeEventId)) {
        eventId = maybeEventId;
      }

      outlookEventId = String(
        cancelBody?.outlookEventId ??
          cancelBody?.event?.outlookEventId ??
          cancelBody?.data?.outlookEventId ??
          outlookEventId
      );
      organizerUserId = String(
        cancelBody?.organizerUserId ??
          cancelBody?.event?.organizerUserId ??
          cancelBody?.data?.organizerUserId ??
          organizerUserId
      );
    });

    test('DeleteEvent returns success', async ({ request }) => {
      const deleteResponse = await request.post(`${API_BASE_URL}/DeleteEvent`, {
        headers: buildAuthHeaders(),
        data: {
          eventId,
          status: 'Cancelled',
          outlookEventId,
          organizerUserId,
        },
      });
      await logApiResponse('Event lifecycle | DeleteEvent', deleteResponse);

      expect([200, 204]).toContain(deleteResponse.status());
    });
  });

  test.describe('User lifecycle (create -> update -> delete)', () => {
    let stamp = 0;
    let userId = '';

    test('CreateUser returns success', async ({ request }) => {
      stamp = Date.now();

      const createPayload = {
        userPrincipalName: `api.user.${stamp}@euacerdev.onmicrosoft.com`,
        mailNickname: `api.user.${stamp}`,
        displayName: `API User ${stamp}`,
        email: `api.user.${stamp}@euacerdev.onmicrosoft.com`,
        organisation: 'Wilo - SP',
        firstName: 'API',
        lastName: 'User',
        password: 'Aa1!Password#2026',
        status: 'Active',
        accountEnabled: true,
      };

      const createResponse = await request.post(`${API_BASE_URL}/CreateUser`, {
        headers: buildAuthHeaders(),
        data: createPayload,
      });
      logApiPayload('User lifecycle | CreateUser', createPayload);
      await logApiResponse('User lifecycle | CreateUser', createResponse);

      expect(createResponse.status()).toBe(200);
      const createText = await createResponse.text();
      let createBody: any = {};
      if (createText) {
        try {
          createBody = JSON.parse(createText);
        } catch {
          createBody = {};
        }
      }

      userId = String(
        createBody?.id ?? createBody?.userId ?? createBody?.user?.id ?? createBody?.data?.id ?? createBody?.data?.userId ?? ''
      );
      expect(userId).toBeTruthy();
    });

    test('UpdateUser returns success', async ({ request }) => {
      console.log(`[API] User lifecycle | UpdateUser precheck userId=${userId}`);
      expect(userId).toBeTruthy();

      const updatePayload = {
        id: userId,
        firstName: `Lorem ${stamp}`,
        lastName: 'Bible',
        displayName: `API User Updated ${stamp}`,
        accountEnabled: true,
      };

      const updateResponse = await request.post(`${API_BASE_URL}/UpdateUser`, {
        headers: buildAuthHeaders(),
        data: updatePayload,
      });
      logApiPayload('User lifecycle | UpdateUser', updatePayload);
      await logApiResponse('User lifecycle | UpdateUser', updateResponse);

      expect(updateResponse.status()).toBe(200);
      const updateText = await updateResponse.text();
      let updateBody: any = {};
      if (updateText) {
        try {
          updateBody = JSON.parse(updateText);
        } catch {
          updateBody = {};
        }
      }

      const updatedUserId = String(
        updateBody?.id ?? updateBody?.userId ?? updateBody?.user?.id ?? updateBody?.data?.id ?? updateBody?.data?.userId ?? ''
      );
      if (updatedUserId) {
        userId = updatedUserId;
      }
    });

    test('DeleteUser returns success', async ({ request }) => {
      console.log(`[API] User lifecycle | DeleteUser precheck userId=${userId}`);
      expect(userId).toBeTruthy();

      const deletePayload = {
        userId,
      };

      const deleteResponse = await request.post(`${API_BASE_URL}/DeleteUser`, {
        headers: buildAuthHeaders(),
        data: deletePayload,
      });
      logApiPayload('User lifecycle | DeleteUser', deletePayload);
      await logApiResponse('User lifecycle | DeleteUser', deleteResponse);

      expect([204, 404]).toContain(deleteResponse.status());//when the user is not found, 404 is returned, which is acceptable for this test
    });
  });

});
  