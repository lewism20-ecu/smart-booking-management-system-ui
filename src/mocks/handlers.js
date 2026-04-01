import { delay, http, HttpResponse } from "msw";
import mockUsers from "../features/auth/data/mockUsers.json";

export const handlers = [
  http.post("/mock-api/v1/auth/login", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    await delay(350);

    if (!email || !password) {
      return HttpResponse.json(
        {
          error: "BadRequest",
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const user = mockUsers.find(
      (record) => record.email === email && record.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid credentials.",
        },
        { status: 401 },
      );
    }

    const fakeToken = `mock-jwt-${user.userId}-${Date.now()}`;

    return HttpResponse.json({
      token: fakeToken,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  }),
];
