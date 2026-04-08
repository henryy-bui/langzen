describe("email module exports", () => {
  it("exports sendVerificationEmail function", async () => {
    const emailModule = await import("./email");
    expect(typeof emailModule.sendVerificationEmail).toBe("function");
  });

  it("exports sendCertificateEmail function", async () => {
    const emailModule = await import("./email");
    expect(typeof emailModule.sendCertificateEmail).toBe("function");
  });
});
