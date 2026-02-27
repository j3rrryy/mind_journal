PASSWORD_RESET_HEADER = "Reset your password"

PASSWORD_RESET_CONTENT = """
    <p>Hello, <strong>{username}</strong>!</p>
    <p>We received a request to reset your password. Use the following code to proceed:</p>
    <div class="code-box">
        <p class="reset-code">{code}</p>
    </div>
    <div class="info-box">
        <p>This code is valid for 10 minutes.</p>
    </div>
"""

PASSWORD_RESET_FOOTER = (
    "<p>If you did not request this, you can safely ignore this email.</p>"
)
