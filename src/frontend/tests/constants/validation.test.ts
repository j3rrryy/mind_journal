import {
  USERNAME_PATTERN,
  EMAIL_PATTERN,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  RESET_CODE_LENGTH,
} from "@/lib/constants/validation";

describe("USERNAME_PATTERN", () => {
  it("should match valid usernames", () => {
    expect("john").toMatch(USERNAME_PATTERN);
    expect("john_doe").toMatch(USERNAME_PATTERN);
    expect("john123").toMatch(USERNAME_PATTERN);
    expect("John_Doe123").toMatch(USERNAME_PATTERN);
  });

  it("should not match invalid usernames", () => {
    expect("ab").not.toMatch(USERNAME_PATTERN);
    expect("ab").not.toMatch(USERNAME_PATTERN);
    expect("a".repeat(31)).not.toMatch(USERNAME_PATTERN);
    expect("john doe").not.toMatch(USERNAME_PATTERN);
    expect("john@doe").not.toMatch(USERNAME_PATTERN);
  });

  it("should have correct min length", () => {
    expect("abc").toMatch(USERNAME_PATTERN);
    expect("ab").not.toMatch(USERNAME_PATTERN);
  });

  it("should have correct max length", () => {
    expect("a".repeat(30)).toMatch(USERNAME_PATTERN);
    expect("a".repeat(31)).not.toMatch(USERNAME_PATTERN);
  });
});

describe("EMAIL_PATTERN", () => {
  it("should match valid emails", () => {
    expect("test@example.com").toMatch(EMAIL_PATTERN);
    expect("user.name@domain.co.uk").toMatch(EMAIL_PATTERN);
    expect("user+tag@example.org").toMatch(EMAIL_PATTERN);
    expect("user123@test.co").toMatch(EMAIL_PATTERN);
  });

  it("should not match invalid emails", () => {
    expect("invalid").not.toMatch(EMAIL_PATTERN);
    expect("invalid@").not.toMatch(EMAIL_PATTERN);
    expect("@domain.com").not.toMatch(EMAIL_PATTERN);
    expect("invalid@domain").not.toMatch(EMAIL_PATTERN);
    expect("invalid@domain.c").not.toMatch(EMAIL_PATTERN);
    expect("invalid space@domain.com").not.toMatch(EMAIL_PATTERN);
  });
});

describe("EMAIL_MAX_LENGTH", () => {
  it("should be 255", () => {
    expect(EMAIL_MAX_LENGTH).toBe(255);
  });
});

describe("PASSWORD_MIN_LENGTH", () => {
  it("should be 8", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8);
  });
});

describe("PASSWORD_MAX_LENGTH", () => {
  it("should be 128", () => {
    expect(PASSWORD_MAX_LENGTH).toBe(128);
  });
});

describe("RESET_CODE_LENGTH", () => {
  it("should be 6", () => {
    expect(RESET_CODE_LENGTH).toBe(6);
  });
});
