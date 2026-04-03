import { delay, http, HttpResponse } from "msw";
import mockUsers from "../features/auth/data/mockUsers.json";
import mockUserProfiles from "./data/mockUserProfiles.json";
import mockBookings from "./data/mockBookings.json";
import mockResources from "./data/mockResources.json";
import mockVenues from "./data/mockVenues.json";

// In-memory mutable state so create/update/delete work within a session
let bookings = [...mockBookings];
let resources = [...mockResources];
let venues = [...mockVenues];
let userProfiles = [...mockUserProfiles];

function getTokenUserId(request) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  // mock token format: mock-jwt-{userId}-{timestamp}
  const match = token.match(/^mock-jwt-(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

function unauthorized() {
  return HttpResponse.json(
    { error: "Unauthorized", message: "Missing token" },
    { status: 401 },
  );
}

function forbidden() {
  return HttpResponse.json(
    { error: "Forbidden", message: "Insufficient permissions." },
    { status: 403 },
  );
}

export const handlers = [
  // ── Auth ────────────────────────────────────────────────────────────────
  http.post("/mock-api/v1/auth/login", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    await delay(350);

    if (!email || !password) {
      return HttpResponse.json(
        { error: "BadRequest", message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = mockUsers.find(
      (r) => r.email === email && r.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        { error: "Unauthorized", message: "Invalid credentials." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: "Login successful",
      token: `mock-jwt-${user.userId}-${Date.now()}`,
      user: { userId: user.userId, email: user.email, role: user.role },
    });
  }),

  http.post("/mock-api/v1/auth/signup", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    await delay(350);

    if (!email || !password) {
      return HttpResponse.json(
        { error: "BadRequest", message: "Email and password are required." },
        { status: 400 },
      );
    }

    if (mockUsers.find((u) => u.email === email)) {
      return HttpResponse.json(
        { error: "Conflict", message: "Email already exists." },
        { status: 409 },
      );
    }

    const newId = Math.max(...userProfiles.map((u) => u.userId)) + 1;
    return HttpResponse.json(
      {
        message: "User created successfully",
        token: `mock-jwt-${newId}-${Date.now()}`,
        user: { userId: newId, email, role: "user" },
      },
      { status: 201 },
    );
  }),

  // ── Users ────────────────────────────────────────────────────────────────
  http.get("/mock-api/v1/users/me", async ({ request }) => {
    await delay(200);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const profile = userProfiles.find((u) => u.userId === userId);
    if (!profile) return unauthorized();

    return HttpResponse.json({ user: profile });
  }),

  http.get("/mock-api/v1/users", async ({ request }) => {
    await delay(200);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const me = userProfiles.find((u) => u.userId === userId);
    if (!me || me.role !== "admin") return forbidden();

    return HttpResponse.json({ users: userProfiles });
  }),

  // ── Bookings ─────────────────────────────────────────────────────────────
  http.get("/mock-api/v1/bookings", async ({ request }) => {
    await delay(250);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const me = userProfiles.find((u) => u.userId === userId);
    // admins and managers see all bookings for approval context; users see own
    const result =
      me?.role === "admin"
        ? bookings
        : me?.role === "manager"
          ? bookings
          : bookings.filter((b) => b.user_id === userId);

    return HttpResponse.json({ bookings: result });
  }),

  http.post("/mock-api/v1/bookings", async ({ request }) => {
    await delay(300);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const body = await request.json().catch(() => ({}));
    const resource = resources.find((r) => r.resource_id === body.resource_id);

    const newBooking = {
      booking_id: Math.max(...bookings.map((b) => b.booking_id)) + 1,
      user_id: userId,
      resource_id: body.resource_id,
      resource_name: resource?.name ?? "Unknown",
      resource_type: resource?.type ?? "room",
      venue_id: resource?.venue_id ?? null,
      venue_name: resource?.venue_name ?? "Unknown",
      start_time: body.start_time,
      end_time: body.end_time,
      status: resource?.approval_required ? "pending" : "approved",
      created_at: new Date().toISOString(),
    };

    bookings = [...bookings, newBooking];
    return HttpResponse.json({ booking: newBooking }, { status: 201 });
  }),

  http.delete("/mock-api/v1/bookings/:id", async ({ request, params }) => {
    await delay(250);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const id = parseInt(params.id, 10);
    const booking = bookings.find((b) => b.booking_id === id);

    if (!booking) {
      return HttpResponse.json(
        { message: "Booking not found." },
        { status: 404 },
      );
    }
    if (booking.user_id !== userId) return forbidden();

    bookings = bookings.filter((b) => b.booking_id !== id);
    return HttpResponse.json({ message: "Booking cancelled." });
  }),

  http.patch("/mock-api/v1/bookings/:id", async ({ request, params }) => {
    await delay(250);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const id = parseInt(params.id, 10);
    const body = await request.json().catch(() => ({}));
    const idx = bookings.findIndex((b) => b.booking_id === id);

    if (idx === -1) {
      return HttpResponse.json(
        { message: "Booking not found." },
        { status: 404 },
      );
    }
    if (bookings[idx].user_id !== userId) return forbidden();

    bookings[idx] = { ...bookings[idx], ...body };
    return HttpResponse.json({ booking: bookings[idx] });
  }),

  http.post(
    "/mock-api/v1/bookings/:id/approve",
    async ({ request, params }) => {
      await delay(250);
      const userId = getTokenUserId(request);
      if (!userId) return unauthorized();

      const me = userProfiles.find((u) => u.userId === userId);
      if (!me || (me.role !== "manager" && me.role !== "admin"))
        return forbidden();

      const id = parseInt(params.id, 10);
      const idx = bookings.findIndex((b) => b.booking_id === id);
      if (idx === -1) {
        return HttpResponse.json(
          { message: "Booking not found." },
          { status: 404 },
        );
      }

      bookings[idx] = { ...bookings[idx], status: "approved" };
      return HttpResponse.json({ booking: bookings[idx] });
    },
  ),

  http.post("/mock-api/v1/bookings/:id/reject", async ({ request, params }) => {
    await delay(250);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const me = userProfiles.find((u) => u.userId === userId);
    if (!me || (me.role !== "manager" && me.role !== "admin"))
      return forbidden();

    const id = parseInt(params.id, 10);
    const idx = bookings.findIndex((b) => b.booking_id === id);
    if (idx === -1) {
      return HttpResponse.json(
        { message: "Booking not found." },
        { status: 404 },
      );
    }

    bookings[idx] = { ...bookings[idx], status: "rejected" };
    return HttpResponse.json({ booking: bookings[idx] });
  }),

  // ── Resources ────────────────────────────────────────────────────────────
  http.get("/mock-api/v1/resources", async ({ request }) => {
    await delay(200);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const url = new URL(request.url);
    const venueId = url.searchParams.get("venue_id");
    const result = venueId
      ? resources.filter((r) => r.venue_id === parseInt(venueId, 10))
      : resources;

    return HttpResponse.json({ resources: result });
  }),

  http.post("/mock-api/v1/resources", async ({ request }) => {
    await delay(300);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const me = userProfiles.find((u) => u.userId === userId);
    if (!me || me.role !== "admin") return forbidden();

    const body = await request.json().catch(() => ({}));
    const venue = venues.find((v) => v.venue_id === body.venue_id);
    const newResource = {
      resource_id: Math.max(...resources.map((r) => r.resource_id)) + 1,
      name: body.name,
      type: body.type,
      capacity: body.capacity,
      venue_id: body.venue_id,
      venue_name: venue?.name ?? "Unknown",
      approval_required: body.approval_required ?? false,
    };

    resources = [...resources, newResource];
    return HttpResponse.json({ resource: newResource }, { status: 201 });
  }),

  // ── Venues ───────────────────────────────────────────────────────────────
  http.get("/mock-api/v1/venues", async ({ request }) => {
    await delay(200);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    return HttpResponse.json({ venues });
  }),

  http.post("/mock-api/v1/venues", async ({ request }) => {
    await delay(300);
    const userId = getTokenUserId(request);
    if (!userId) return unauthorized();

    const me = userProfiles.find((u) => u.userId === userId);
    if (!me || (me.role !== "manager" && me.role !== "admin"))
      return forbidden();

    const body = await request.json().catch(() => ({}));
    const newVenue = {
      venue_id: Math.max(...venues.map((v) => v.venue_id)) + 1,
      name: body.name,
      location: body.location ?? "",
      approval_required: body.approval_required ?? false,
      manager_ids: [userId],
      image_url: null,
      total_seats: 0,
    };

    venues = [...venues, newVenue];
    return HttpResponse.json({ venue: newVenue }, { status: 201 });
  }),
];
