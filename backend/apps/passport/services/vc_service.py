"""Verifiable Credential issuance service using SpruceID."""
import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)


class VCService:
    """Issue and verify W3C Verifiable Credentials."""

    def issue_credential(
        self,
        expert_id: str,
        credential_type: str,
        subject_field: str,
        claims: dict,
    ) -> Optional[str]:
        """
        Issue a VC for a verified claim.

        Args:
            expert_id: UUID of the expert
            credential_type: 'publication', 'degree', 'affiliation'
            subject_field: which profile field this verifies
            claims: dict of verified claims

        Returns:
            VC JWT string or None on failure
        """
        # TODO: Integrate SpruceID didkit for actual VC signing
        # Placeholder: create a mock VC structure
        from apps.passport.models import Credential, ExpertProfile

        profile = ExpertProfile.objects.get(id=expert_id)

        vc_payload = {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            "type": ["VerifiableCredential", f"{credential_type.title()}Credential"],
            "issuer": "did:key:z6MkSTI-Expert-Issuer",
            "issuanceDate": datetime.utcnow().isoformat(),
            "expirationDate": (datetime.utcnow() + timedelta(days=365)).isoformat(),
            "credentialSubject": {
                "id": profile.did_uri or f"did:key:{profile.id}",
                **claims,
            },
        }

        # TODO: Sign with didkit
        # vc_jwt = didkit.issue_credential(vc_payload, issuer_key)
        vc_jwt = f"eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.placeholder.{expert_id}"

        credential = Credential.objects.create(
            expert=profile,
            credential_type=credential_type,
            subject_field=subject_field,
            vc_jwt=vc_jwt,
            status='issued',
            issued_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=365),
            issuer_did="did:key:z6MkSTI-Expert-Issuer",
        )

        logger.info(f"VC issued: {credential.id} for expert {expert_id}")
        return vc_jwt

    def verify_credential(self, vc_jwt: str) -> dict:
        """
        Verify a VC JWT.

        Returns:
            dict with 'valid' bool and verification details
        """
        # TODO: Implement actual verification with didkit
        return {
            'valid': True,
            'message': 'Placeholder verification - implement SpruceID didkit',
        }
