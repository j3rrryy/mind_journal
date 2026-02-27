EMAIL_CONFIRMATION_HEADER = "Confirm your email"

EMAIL_CONFIRMATION_CONTENT = """
    <p>Hello, <strong>{username}</strong>!</p>
    <p>Thank you for creating your account. Please confirm your email address by clicking the button below:</p>
    <div class="button-wrapper">
        <a href="{confirmation_url}" class="button">Confirm email</a>
    </div>
    <div class="info-box">
        <p>This link is valid for 3 days.</p>
    </div>
"""

EMAIL_CONFIRMATION_FOOTER = """
    <p>If you did not create this account, you can safely ignore this email.</p>
"""
