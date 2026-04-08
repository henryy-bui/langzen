import { registerUser } from "./actions";

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/email", () => ({
  sendVerificationEmail: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

const mockUUID = "test-uuid-1234";
jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID as `${string}-${string}-${string}-${string}-${string}`);

import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

const mockDb = db as jest.Mocked<typeof db>;
const mockSendEmail = sendVerificationEmail as jest.MockedFunction<typeof sendVerificationEmail>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerUser", () => {
  it("returns error when email is already taken", async () => {
    (mockDb.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-user" });

    const result = await registerUser({
      name: "Test User",
      email: "existing@test.com",
      password: "Password1",
    });

    expect(result).toEqual({ success: false, error: "emailTaken" });
  });

  it("creates user and sends verification email on success", async () => {
    (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockDb.user.create as jest.Mock).mockResolvedValue({ id: "new-user", email: "new@test.com" });
    (mockDb.verificationToken.create as jest.Mock).mockResolvedValue({});
    mockSendEmail.mockResolvedValue(undefined);

    const result = await registerUser({
      name: "New User",
      email: "new@test.com",
      password: "Password1",
    });

    expect(result).toEqual({ success: true, data: null });
    expect(mockDb.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "new@test.com",
          name: "New User",
          hashedPassword: "hashed_password",
        }),
      })
    );
    expect(mockSendEmail).toHaveBeenCalledWith("new@test.com", mockUUID);
  });

  it("returns error for invalid input", async () => {
    const result = await registerUser({
      name: "A",
      email: "not-an-email",
      password: "weak",
    });

    expect(result).toEqual({ success: false, error: "validation" });
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });
});
