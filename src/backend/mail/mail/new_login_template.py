NEW_LOGIN_HEADER = "New login detected"

NEW_LOGIN_CONTENT = """
    <p>Hello, <strong>{username}</strong>!</p>
    <p>We noticed a new login to your account:</p>
    <div class="info-box">
        <p><strong>IP Address:</strong> {user_ip}</p>
        <p><strong>Country:</strong> {country_code}</p>
        <p><strong>Browser:</strong> {browser}</p>
    </div>
"""

NEW_LOGIN_FOOTER = "<p>If it was not you, please change your password immediately!</p>"
