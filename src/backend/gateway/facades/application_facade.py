import datetime

from dto import auth_dto, wellness_dto
from protocols import (
    ApplicationFacadeProtocol,
    AuthFacadeProtocol,
    WellnessFacadeProtocol,
)


class ApplicationFacade(ApplicationFacadeProtocol):
    def __init__(
        self, auth_facade: AuthFacadeProtocol, wellness_facade: WellnessFacadeProtocol
    ):
        self._auth_facade = auth_facade
        self._wellness_facade = wellness_facade

    async def register(self, data: auth_dto.RegistrationDTO, locale: str) -> None:
        await self._auth_facade.register(data, locale)

    async def confirm_email(self, token: str) -> None:
        await self._auth_facade.confirm_email(token)

    async def request_reset_code(self, email: str, locale: str) -> str:
        return await self._auth_facade.request_reset_code(email, locale)

    async def validate_reset_code(self, data: auth_dto.ResetCodeDTO) -> bool:
        return await self._auth_facade.validate_reset_code(data)

    async def reset_password(self, data: auth_dto.ResetPasswordDTO) -> None:
        await self._auth_facade.reset_password(data)

    async def log_in(
        self, data: auth_dto.LogInDTO, locale: str
    ) -> auth_dto.LogInDataDTO:
        return await self._auth_facade.log_in(data, locale)

    async def log_out(self, access_token: str) -> None:
        await self._auth_facade.log_out(access_token)

    async def resend_email_confirmation_mail(
        self, access_token: str, locale: str
    ) -> None:
        await self._auth_facade.resend_email_confirmation_mail(access_token, locale)

    async def auth(self, access_token: str) -> str:
        return await self._auth_facade.auth(access_token)

    async def refresh(self, data: auth_dto.RefreshDTO) -> auth_dto.TokensDTO:
        return await self._auth_facade.refresh(data)

    async def session_list(self, access_token: str) -> list[auth_dto.SessionDTO]:
        return await self._auth_facade.session_list(access_token)

    async def revoke_session(self, data: auth_dto.RevokeSessionDTO) -> None:
        await self._auth_facade.revoke_session(data)

    async def profile(self, access_token: str) -> auth_dto.ProfileDTO:
        return await self._auth_facade.profile(access_token)

    async def update_email(self, data: auth_dto.UpdateEmailDTO, locale: str) -> None:
        await self._auth_facade.update_email(data, locale)

    async def update_password(self, data: auth_dto.UpdatePasswordDTO) -> None:
        await self._auth_facade.update_password(data)

    async def delete_profile(self, access_token: str) -> None:
        user_id = await self._auth_facade.delete_profile(access_token)
        await self._wellness_facade.delete_all(user_id)

    async def upsert_record(
        self, access_token: str, data: wellness_dto.UpsertRecordDTO
    ) -> None:
        user_id = await self.auth(access_token)
        dto = data.replace(user_id=user_id)
        await self._wellness_facade.upsert_record(dto)

    async def record_list(
        self, access_token: str, data: wellness_dto.MonthDTO
    ) -> list[wellness_dto.RecordInfoDTO]:
        user_id = await self.auth(access_token)
        dto = data.replace(user_id=user_id)
        return await self._wellness_facade.record_list(dto)

    async def delete_all(self, access_token: str) -> None:
        user_id = await self.auth(access_token)
        await self._wellness_facade.delete_all(user_id)

    async def dashboard(
        self, access_token: str, client_date: datetime.datetime
    ) -> wellness_dto.DashboardDTO:
        user_id = await self.auth(access_token)
        return await self._wellness_facade.dashboard(user_id, client_date)

    async def analytics(
        self, access_token: str
    ) -> list[wellness_dto.PeriodAnalyticsDTO]:
        user_id = await self.auth(access_token)
        return await self._wellness_facade.analytics(user_id)

    async def recommendations(
        self, access_token: str
    ) -> wellness_dto.RecommendationsDTO:
        user_id = await self.auth(access_token)
        return await self._wellness_facade.recommendations(user_id)
